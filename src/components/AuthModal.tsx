import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Recycle, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCw, 
  Smartphone, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    login, 
    signup, 
    demoLogin, 
    t 
  } = useApp();

  type AuthMode = 'google' | 'otp' | 'password';
  const [mode, setMode] = useState<AuthMode>('google');
  
  // Google sign in states
  const [googleAccountPrompt, setGoogleAccountPrompt] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // OTP flow states
  const [phoneNumber, setPhoneNumber] = useState('9845012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['8', '4', '9', '2']);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpError, setOtpError] = useState('');

  // Password / email states
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('eco2026pass');
  const [formError, setFormError] = useState('');

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  if (!authModalOpen) return null;

  // Google sign-in execution
  const handleGoogleSignIn = (email: string, name: string) => {
    login(email, name);
  };

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setOtpError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 4) {
      setOtpError('Please enter the complete 4-digit verification code.');
      return;
    }
    login(`+91 ${phoneNumber}`, `Eco Member (${phoneNumber.slice(-4)})`);
  };

  // Email / password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (isSignUp) {
      if (!fullName.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      signup(fullName, emailOrPhone);
    } else {
      login(emailOrPhone);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
              <Recycle className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">
                {t('appName')} Sign In
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                Doorstep Recycling & Instant Rewards
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 bg-black/20 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMode('google');
                setOtpError('');
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'google'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('otp');
                setOtpError('');
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'otp'
                  ? 'bg-white text-[#1B5E20] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('password');
                setFormError('');
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'password'
                  ? 'bg-white text-[#1B5E20] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Button always visible at top */}
          <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-emerald-200">
            <button
              type="button"
              onClick={demoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{t('quickDemoUser')}</span>
            </button>
            <span className="text-[10px] text-emerald-800 text-center block mt-1 font-medium">
              1-click test credentials with pre-loaded address and wallet
            </span>
          </div>

          {/* 1. GOOGLE SIGN-IN MODE */}
          {mode === 'google' && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">
                  Continue with your Google Account
                </h4>
                <p className="text-xs text-gray-500">
                  Fast, secure, one-tap sign in with zero passwords required.
                </p>
              </div>

              {/* Main Official Google Button */}
              <button
                type="button"
                onClick={() => setGoogleAccountPrompt(true)}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white text-gray-800 font-bold text-sm flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer hover:shadow-md"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Sign In with Google</span>
              </button>

              {/* Interactive Google Account Chooser */}
              <div className="border border-gray-100 rounded-2xl p-3 bg-[#F8FAF8] space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                  Select Google Account
                </span>

                {/* Account 1: Active User */}
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('saianishkesaraneni@gmail.com', 'Sai Anish Kesaraneni')}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 flex items-center justify-between transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        Sai Anish Kesaraneni
                      </p>
                      <p className="text-[11px] text-gray-500">
                        saianishkesaraneni@gmail.com
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Account 2: Demo Account */}
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('priya.sharma@gmail.com', 'Priya Sharma')}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 flex items-center justify-between transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        Priya Sharma
                      </p>
                      <p className="text-[11px] text-gray-500">
                        priya.sharma@gmail.com
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          )}

          {/* 2. PHONE OTP MODE */}
          {mode === 'otp' && (
            <div className="space-y-4">
              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {!otpSent ? (
                /* Step 1: Enter Phone Number */
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                      Enter 10-Digit Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <div className="px-3 py-2.5 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white font-mono font-bold text-gray-900 text-sm tracking-wide"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-snug">
                    We'll send a 4-digit verification code via SMS for instant password-free verification.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Get OTP on Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Step 2: Enter OTP Code */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Simulated SMS Notification Banner */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💬</span>
                      <div>
                        <span className="font-extrabold block">SMS from EcoPickup</span>
                        <span className="text-[11px] text-blue-700">
                          Your verification code is <b>8492</b>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpDigits(['8', '4', '9', '2'])}
                      className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">
                        Enter 4-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#2E7D32] hover:underline font-bold cursor-pointer"
                      >
                        Change Number (+91 {phoneNumber})
                      </button>
                    </div>

                    {/* 4 Digit Boxes */}
                    <div className="grid grid-cols-4 gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const copy = [...otpDigits];
                            copy[idx] = val;
                            setOtpDigits(copy);
                            if (val && idx < 3) {
                              const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                              nextInput?.focus();
                            }
                          }}
                          className="w-full h-12 text-center text-lg font-black font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white text-gray-900"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {resendTimer > 0 ? (
                      <span>Resend OTP in <b className="text-gray-800">{resendTimer}s</b></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResendTimer(30)}
                        className="text-[#2E7D32] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Resend OTP Now</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. EMAIL & PASSWORD MODE */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block">
                    {t('fullName')} *
                  </label>
                  <div className="relative mt-1">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-gray-600 block">
                  {t('emailOrPhone')} *
                </label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="priya.sharma@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 block">
                  {t('password')} *
                </label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-[#2E7D32] hover:underline font-semibold cursor-pointer"
                >
                  {isSignUp ? t('alreadyHaveAccount') : t('noAccountYet')}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer mt-2"
              >
                {isSignUp ? t('signUpBtn') : t('signInBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Official Google G SVG component
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}
