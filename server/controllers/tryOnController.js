/**
 * CODED FIT — AI Virtual Try-On controller.
 *
 * POST /api/try-on      → createTryOn (accepts multipart file or JSON base64/URL)
 * GET  /api/try-on/:id  → getTryOnStatus (polling for async providers)
 *
 * Privacy: uploaded photos are processed by the configured AI provider and
 * never persisted. Temp upload files are always deleted. Nothing is written
 * to the database unless the user explicitly saves the result client-side.
 */
const fs = require('fs');
const vto = require('../services/virtualTryOnService');

function cleanupUpload(file) {
  if (!file || !file.path) return;
  fs.unlink(file.path, () => {});
}

exports.createTryOn = async (req, res, next) => {
  try {
    const { garmentImageUrl, garmentImageBase64, garmentType = 'top', garmentMeta, bodyParameters } = req.body || {};
    let { modelImageUrl, modelImageBase64 } = req.body || {};

    // Multipart photo upload → base64 (temp file is always removed below)
    if (req.file) {
      try {
        const buf = fs.readFileSync(req.file.path);
        modelImageBase64 = `data:${req.file.mimetype};base64,${buf.toString('base64')}`;
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Could not read the uploaded photo. Please try a JPG, PNG, or WebP under 10MB.'
        });
      }
    }

    let meta = garmentMeta;
    if (typeof garmentMeta === 'string') {
      try {
        meta = JSON.parse(garmentMeta);
      } catch (e) {
        meta = undefined;
      }
    }

    const { task, unavailable } = await vto.createTryOnTask({
      modelImage: modelImageBase64 || modelImageUrl,
      garmentImage: garmentImageBase64 || garmentImageUrl,
      garmentType,
      garmentMeta: meta,
      bodyParameters
    });

    if (unavailable || task.unavailable) {
      return res.status(503).json({
        success: false,
        unavailable: true,
        message: 'AI Try-On is currently unavailable.'
      });
    }

    if (task.status === 'failed') {
      return res.status(503).json({
        success: false,
        message: task.error || 'Virtual try-on is temporarily unavailable. Please try again in a few moments.'
      });
    }

    // Synchronous provider: completed immediately. Envelope still carries the
    // taskId so future async providers can return { status: 'processing' } and
    // clients can poll GET /api/try-on/:taskId without any contract change.
    return res.status(task.status === 'completed' ? 200 : 202).json({
      success: true,
      taskId: task.id,
      status: task.status,
      resultImageUrl: task.resultImageUrl,
      fitScore: task.fitScore !== undefined ? task.fitScore : null,
      biometricNodesDetected: task.biometricNodesDetected || null,
      drapePrecision: task.fitScore ? `${task.fitScore}% Biometric Match` : 'Fit score unavailable',
      message: task.message || 'AI try-on complete'
    });
  } catch (err) {
    if (err.isOperational) {
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
    next(err);
  } finally {
    cleanupUpload(req.file);
  }
};

exports.getTryOnStatus = async (req, res) => {
  const status = vto.getTryOnStatus(req.params.taskId);
  if (!status) {
    return res.status(404).json({
      success: false,
      message: 'Try-on task not found or expired. Please generate a new fitting.'
    });
  }
  res.json({ success: true, task: status });
};
