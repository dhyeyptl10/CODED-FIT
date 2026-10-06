'use client';

import React, { useState } from 'react';
import { X, Phone, Lock, Sparkles, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, loginMode, closeLoginModal, setAuth, openLoginModal } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendOtp(phone);
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setStep('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter the 6-digit OTP received.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.verifyOtp(phone, otp, fullName);
      if (res.token && res.user) {
        setAuth(res.user, res.token);
        closeLoginModal();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setLoading(true);
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setAuth(data.user, data.token);
      closeLoginModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Email authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/75 backdrop-blur-xs" onClick={closeLoginModal} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-porcelain rounded-2xl border border-border-light shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top Brand Banner */}
        <div className="bg-obsidian text-porcelain p-6 flex justify-between items-start">
          <div>
            <span className="font-headline font-black text-xl tracking-tight text-porcelain">
              CODED<span className="text-vermillion">✦</span>FIT
            </span>
            <p className="text-[11px] font-mono text-gold tracking-widest uppercase mt-0.5">
              ATELIER IDENTITY CALIBRATION
            </p>
          </div>
          <button
            onClick={closeLoginModal}
            className="text-gray-400 hover:text-porcelain p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-border-light text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              openLoginModal('otp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-bold text-center transition-colors ${
              loginMode === 'otp'
                ? 'bg-porcelain text-obsidian border-b-2 border-gold'
                : 'bg-alabaster text-gray-500 hover:text-obsidian'
            }`}
          >
            PHONE &amp; OTP
          </button>
          <button
            type="button"
            onClick={() => {
              openLoginModal('email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-bold text-center transition-colors ${
              loginMode === 'email'
                ? 'bg-porcelain text-obsidian border-b-2 border-gold'
                : 'bg-alabaster text-gray-500 hover:text-obsidian'
            }`}
          >
            EMAIL &amp; PASSWORD
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-vermillion text-xs font-mono rounded">
              {errorMsg}
            </div>
          )}

          {loginMode === 'otp' ? (
            step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-gray-700 uppercase">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-mono text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      required
                      className="w-full pl-12 pr-4 py-2.5 bg-alabaster border border-border-light rounded-lg text-sm font-mono text-obsidian focus:outline-none focus:border-gold"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-gray-500">
                    We will send a 6-digit authentication token via SMS.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-gray-700 uppercase">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    className="w-full px-3 py-2 bg-alabaster border border-border-light rounded-lg text-sm font-body text-obsidian focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-3 rounded-lg font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'SENDING OTP...' : 'SEND ACCESS OTP'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center pb-2">
                  <p className="text-xs font-mono text-gray-600">
                    OTP sent to <strong className="text-obsidian">+91 {phone}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[11px] font-mono text-gold-dark hover:underline mt-0.5 inline-block"
                  >
                    Edit Phone Number
                  </button>
                </div>

                {devCode && (
                  <div className="p-2.5 bg-gold/10 border border-gold/30 rounded text-center">
                    <span className="text-[10px] font-mono text-gray-600 uppercase block">DEV TEST OTP</span>
                    <strong className="text-sm font-mono text-gold-dark tracking-widest">{devCode}</strong>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-gray-700 uppercase block text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full py-3 bg-alabaster border border-border-light rounded-lg text-center font-mono font-bold text-xl tracking-widest text-obsidian focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-3 rounded-lg font-mono font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY & ENTER ATELIER'}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-gray-700 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@codedfit.in"
                  required
                  className="w-full px-3 py-2 bg-alabaster border border-border-light rounded-lg text-sm text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-gray-700 uppercase">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 bg-alabaster border border-border-light rounded-lg text-sm text-obsidian focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian py-3 rounded-lg font-mono font-bold text-xs tracking-wider uppercase transition-colors"
              >
                {loading ? 'AUTHENTICATING...' : 'SIGN IN WITH PASSWORD'}
              </button>
            </form>
          )}

          <a className="block mt-4 text-center text-sm underline" href="/register" onClick={closeLoginModal}>Create an account with email</a>
          <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-500">
            <Shield size={12} className="text-emerald-600" />
            <span>Your measurements remain linked to your account</span>
          </div>
        </div>
      </div>
    </div>
  );
};
