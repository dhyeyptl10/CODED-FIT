const FitProfile = require('../models/FitProfile');
const User = require('../models/User');

exports.getMyFitProfile = async (req, res, next) => {
  try {
    const profile = await FitProfile.findOne({ userId: req.user._id });
    res.json({
      success: true,
      fitProfile: profile || null
    });
  } catch (err) {
    next(err);
  }
};

exports.saveFitProfile = async (req, res, next) => {
  try {
    const {
      heightCm,
      weightKg,
      chestIn,
      waistIn,
      hipIn,
      shoulderIn,
      sleeveIn,
      inseamIn,
      bodyShape,
      preferredFit,
      preferredLength,
      source
    } = req.body;

    let profile = await FitProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new FitProfile({
        userId: req.user._id,
        heightCm: heightCm || 176,
        weightKg: weightKg || 68,
        chestIn: chestIn || 40,
        waistIn: waistIn || 32,
        hipIn: hipIn || 38,
        shoulderIn: shoulderIn || 18,
        sleeveIn: sleeveIn || 25,
        inseamIn: inseamIn || 31,
        bodyShape: bodyShape || 'athletic',
        preferredFit: preferredFit || 'regular',
        preferredLength: preferredLength || 'standard',
        source: source || 'manual'
      });
    } else {
      if (heightCm) profile.heightCm = heightCm;
      if (weightKg) profile.weightKg = weightKg;
      if (chestIn) profile.chestIn = chestIn;
      if (waistIn) profile.waistIn = waistIn;
      if (hipIn) profile.hipIn = hipIn;
      if (shoulderIn) profile.shoulderIn = shoulderIn;
      if (sleeveIn) profile.sleeveIn = sleeveIn;
      if (inseamIn) profile.inseamIn = inseamIn;
      if (bodyShape) profile.bodyShape = bodyShape;
      if (preferredFit) profile.preferredFit = preferredFit;
      if (preferredLength) profile.preferredLength = preferredLength;
      if (source) profile.source = source;
    }

    await profile.save();

    // Link to User
    await User.findByIdAndUpdate(req.user._id, { fitProfile: profile._id });

    res.json({
      success: true,
      message: 'Fit Profile saved successfully.',
      fitProfile: profile
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendation = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user) {
      profile = await FitProfile.findOne({ userId: req.user._id });
    }

    if (!profile) {
      return res.json({
        success: true,
        recommendation: {
          hasProfile: false,
          recommendedSize: 'M',
          recommendedFit: 'Regular Fit',
          label: 'Standard Fit',
          note: 'Save your Fit Profile for personalized tailoring recommendations'
        }
      });
    }

    res.json({
      success: true,
      recommendation: {
        hasProfile: true,
        recommendedSize: profile.recommendedSize,
        recommendedFit: `${profile.preferredFit.charAt(0).toUpperCase() + profile.preferredFit.slice(1)} Fit`,
        label: 'Recommended for your Fit Profile',
        note: `AI recommended size: ${profile.recommendedSize} (${profile.preferredFit} fit) based on your saved measurements`
      }
    });
  } catch (err) {
    next(err);
  }
};
