/**
 * CODED FIT — Virtual Try-On abstraction.
 *
 * Single entry point for AI photo try-on. Provider-specific code stays in
 * server/services/* (today: youcamService.js). This module owns:
 *   - input validation (safe, user-facing messages)
 *   - task lifecycle: createTryOnTask() / getTryOnStatus() / getTryOnResult()
 *   - honest availability: when no provider is configured it reports
 *     { unavailable: true } — it NEVER returns the garment image as a result.
 *
 * Current provider is synchronous (one YouCam call per task). The task
 * envelope already supports async providers: a future provider can return
 * { status: 'processing' } and complete the task later; clients poll
 * GET /api/try-on/:taskId via getTryOnStatus().
 */
const crypto = require('crypto');
const youcamService = require('./youcamService');

const TASK_TTL_MS = 15 * 60 * 1000;
const MAX_IMAGE_CHARS = 14 * 1024 * 1024; // ~10MB binary as base64, under the 15mb body limit
const GARMENT_TYPES = ['top', 'bottom', 'dress', 'jacket', 'accessories'];

const tasks = new Map();

// Best-effort TTL sweep; unref'd so it never keeps the process alive.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [id, task] of tasks) {
    if (now - task.createdAt > TASK_TTL_MS) tasks.delete(id);
  }
}, 5 * 60 * 1000);
if (sweeper.unref) sweeper.unref();

function fail(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  throw err;
}

function providerName() {
  return process.env.VTO_PROVIDER || 'youcam';
}

function isAvailable() {
  if (providerName() !== 'youcam') return false;
  return youcamService.isConfigured();
}

function unavailableReason() {
  if (providerName() !== 'youcam') {
    return `Try-on provider "${providerName()}" is not implemented. Set VTO_PROVIDER=youcam with valid YouCam credentials.`;
  }
  return 'AI Try-On is currently unavailable. The virtual fitting provider is not configured on the server.';
}

function validateImage(value, field) {
  if (!value || typeof value !== 'string' || !value.trim()) return null;
  const v = value.trim();
  if (v.startsWith('data:')) {
    if (!/^data:image\/(jpeg|png|webp);base64,/i.test(v)) {
      fail(`${field}: unsupported image format. Use JPG, PNG, or WebP.`);
    }
    if (v.length > MAX_IMAGE_CHARS) {
      fail(`${field}: image is too large. Please use a photo under 10MB.`);
    }
    return v;
  }
  if (!/^https?:\/\/.{4,2048}$/i.test(v)) {
    fail(`${field}: must be an image upload or an http(s) image URL.`);
  }
  return v;
}

function publicTask(task) {
  const out = {
    taskId: task.id,
    status: task.status,
    createdAt: new Date(task.createdAt).toISOString()
  };
  if (task.status === 'completed') {
    out.resultImageUrl = task.resultImageUrl;
    out.fitScore = task.fitScore !== undefined ? task.fitScore : null;
    out.biometricNodesDetected = task.biometricNodesDetected || null;
    out.drapePrecision = task.fitScore ? `${task.fitScore}% Biometric Match` : 'Fit score unavailable';
    out.message = task.message || 'AI try-on complete';
  } else if (task.status === 'failed') {
    out.message = task.error || 'Virtual try-on failed. Please try again.';
  }
  return out;
}

async function createTryOnTask({ modelImage, garmentImage, garmentType = 'top', garmentMeta, bodyParameters }) {
  const photo = validateImage(modelImage, 'Photo');
  if (!photo) {
    fail('Please upload a clear, front-facing photo in good lighting.');
  }
  const garment = validateImage(garmentImage, 'Garment');
  if (!garment) {
    fail('Please select a CODED FIT garment to try on.');
  }
  if (!GARMENT_TYPES.includes(garmentType)) {
    fail(`Garment type "${garmentType}" is not supported.`);
  }

  let parsedBody;
  if (bodyParameters !== undefined) {
    if (typeof bodyParameters === 'string') {
      try {
        parsedBody = JSON.parse(bodyParameters);
      } catch (e) {
        parsedBody = undefined;
      }
    } else if (typeof bodyParameters === 'object' && bodyParameters !== null) {
      parsedBody = bodyParameters;
    }
  }

  const task = {
    id: crypto.randomBytes(12).toString('hex'),
    status: 'processing',
    createdAt: Date.now(),
    garmentType,
    garmentMeta: garmentMeta && typeof garmentMeta === 'object' ? garmentMeta : undefined
  };
  tasks.set(task.id, task);

  if (!isAvailable()) {
    task.status = 'failed';
    task.unavailable = true;
    task.error = unavailableReason();
    return { task, unavailable: true };
  }

  try {
    const result = await youcamService.executeTryOn({
      modelImageBase64: photo.startsWith('data:') ? photo : undefined,
      modelImageUrl: photo.startsWith('data:') ? undefined : photo,
      garmentImageUrl: garment,
      garmentType,
      bodyParameters: parsedBody
    });

    // A provider must never resolve "success" with the input garment as output.
    if (!result || result.success !== true || !result.resultImageUrl) {
      task.status = 'failed';
      task.error = 'Virtual try-on is temporarily unavailable. Please try again in a few moments.';
      return { task };
    }

    task.status = 'completed';
    task.resultImageUrl = result.resultImageUrl;
    task.fitScore = result.fitScore !== undefined ? result.fitScore : null;
    task.biometricNodesDetected = result.biometricNodesDetected || null;
    task.message = result.message || 'AI try-on complete';
    return { task };
  } catch (err) {
    task.status = 'failed';
    task.error = 'Virtual try-on is temporarily unavailable. Please try again in a few moments.';
    return { task };
  }
}

function getTryOnStatus(taskId) {
  if (!taskId || typeof taskId !== 'string') return null;
  const task = tasks.get(taskId);
  return task ? publicTask(task) : null;
}

function getTryOnResult(taskId) {
  const task = taskId && tasks.get(taskId);
  if (!task || task.status !== 'completed') return null;
  return publicTask(task);
}

module.exports = {
  providerName,
  isAvailable,
  unavailableReason,
  createTryOnTask,
  getTryOnStatus,
  getTryOnResult
};
