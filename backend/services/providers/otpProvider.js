/**
 * CODED FIT — OTP Provider Abstraction
 * Handles real phone verification with SMS gateway or development testing.
 */

const otpStore = new Map(); // phone -> { code, expiresAt, attempts }

class OtpProvider {
  async sendOtp(phone) {
    throw new Error('sendOtp must be implemented');
  }

  async verifyOtp(phone, code) {
    throw new Error('verifyOtp must be implemented');
  }
}

class DevelopmentOtpProvider extends OtpProvider {
  async sendOtp(phone) {
    // Generate secure 6-digit OTP
    const code = require('crypto').randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(phone, { code, expiresAt, attempts: 0 });
    console.log(`\n[CODED FIT AUTH] 📲 OTP for ${phone}: [ ${code} ] (Expires in 5m)\n`);

    return {
      success: true,
      message: 'OTP sent to mobile number',
      devCode: process.env.NODE_ENV !== 'production' ? code : undefined
    };
  }

  async verifyOtp(phone, code) {
    const record = otpStore.get(phone);
    if (!record) {
      return { success: false, message: 'OTP expired or not requested' };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return { success: false, message: 'OTP has expired. Request a new one.' };
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      if (record.attempts >= 4) {
        otpStore.delete(phone);
        return { success: false, message: 'Too many incorrect attempts. Request a new OTP.' };
      }
      return { success: false, message: 'Incorrect OTP' };
    }

    otpStore.delete(phone);
    return { success: true };
  }
}

class SmsGatewayOtpProvider extends OtpProvider {
  constructor() {
    super();
    this.apiKey = process.env.SMS_GATEWAY_API_KEY;
  }

  async sendOtp(phone) {
    if (!this.apiKey) {
      throw new Error('SMS Gateway API key is missing. Set SMS_GATEWAY_API_KEY.');
    }
    // Real SMS dispatch via provider API (e.g. MSG91, Twilio)
    throw Object.assign(new Error('SMS provider integration is not configured. Use email login.'), {statusCode:503});
  }

  async verifyOtp(phone, code) {
    throw Object.assign(new Error('SMS verification is unavailable.'), {statusCode:503});
  }
}

function getOtpProvider() {
  const isConfigured = Boolean(process.env.SMS_GATEWAY_API_KEY);
  return isConfigured || process.env.NODE_ENV === 'production' ? new SmsGatewayOtpProvider() : new DevelopmentOtpProvider();
}

module.exports = {
  OtpProvider,
  DevelopmentOtpProvider,
  SmsGatewayOtpProvider,
  getOtpProvider
};
