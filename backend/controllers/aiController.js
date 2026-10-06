const ollamaService = require('../services/ollamaService');

exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const userId = req.user ? req.user._id : null;
    const result = await ollamaService.chat({
      message,
      history,
      userId,
      userProfile: req.user?.fitProfile || null
    });

    res.json({
      success: true,
      response: result.response,
      toolsUsed: result.toolsUsed || [],
      products: result.products || [],
      data: result.data || null
    });
  } catch (err) {
    next(err);
  }
};

exports.analyzeVision = async (req, res, next) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Image data is required.' });
    }

    const result = await ollamaService.analyzeImage({
      imageBase64,
      prompt: prompt || 'Analyze face shape, shoulder width, and recommended bespoke collar style.'
    });

    res.json({
      success: true,
      analysis: result.analysis
    });
  } catch (err) {
    next(err);
  }
};
