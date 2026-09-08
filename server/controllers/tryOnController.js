const youcamService = require('../services/youcamService');
const fs = require('fs');

exports.executeTryOn = async (req, res, next) => {
  try {
    const { modelImageUrl, garmentImageUrl, garmentType = 'top', bodyParameters } = req.body;
    let modelImageBase64 = req.body.modelImageBase64;

    // Handle file upload if sent as multipart
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      modelImageBase64 = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }

    if (!modelImageBase64 && !modelImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a clear full-body or portrait photo in good lighting.'
      });
    }

    if (!garmentImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please select a garment to try on.'
      });
    }

    let parsedBodyParams = bodyParameters;
    if (typeof bodyParameters === 'string') {
      try {
        parsedBodyParams = JSON.parse(bodyParameters);
      } catch (e) {
        parsedBodyParams = undefined;
      }
    }

    const result = await youcamService.executeTryOn({
      modelImageBase64,
      modelImageUrl,
      garmentImageUrl,
      garmentType,
      bodyParameters: parsedBodyParams
    });

    if (!result.success) {
      return res.status(503).json({
        success: false,
        message: 'Virtual try-on is temporarily unavailable. Please try again in a few moments.'
      });
    }

    res.json({
      success: true,
      resultImageUrl: result.resultImageUrl,
      // Strictly follows Section 5: real confidence score or null ("Fit score unavailable")
      fitScore: result.fitScore !== undefined ? result.fitScore : null,
      biometricNodesDetected: result.biometricNodesDetected || null,
      drapePrecision: result.fitScore ? `${result.fitScore}% Biometric Match` : 'Fit score unavailable',
      message: result.message || 'AI try-on complete'
    });
  } catch (err) {
    console.error('[Try-On Error]:', err.message);
    res.status(503).json({
      success: false,
      message: 'Virtual try-on is temporarily unavailable.'
    });
  }
};
