import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GraduationCap, Timer, ShieldAlert } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

const LoginPage = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Rate Limiting States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Timer interval to count down the lockoutTime
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTime > 0) {
      interval = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockoutTime]);

  const handleGoogleLogin = async () => {
    if (lockoutTime > 0) return;

    // Apply baseline 3 second cooldown immediately upon click
    setLockoutTime(3);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Login failed:", error.message);
      
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLockoutTime(30); // Disable for 30s after 3 consecutive failures
        setFailedAttempts(0); // Reset after applying long penalty
      }
    }
  };

  const isButtonDisabled = lockoutTime > 0 || !captchaToken;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Guru Digital</h1>
        <p className="text-slate-500 mt-2 mb-8">Selamat datang! Silakan masuk untuk mengakses dokumen Anda.</p>

        {/* Turnstile CAPTCHA Component */}
        <div className="flex justify-center mb-6">
          <Turnstile 
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
            onSuccess={(token) => setCaptchaToken(token)}
            onError={() => setCaptchaToken(null)}
            onExpire={() => setCaptchaToken(null)}
            options={{
              theme: 'light',
              size: 'normal'
            }}
          />
        </div>

        {/* Warning messages */}
        {lockoutTime > 0 && (
          <div className="mb-4 text-sm font-medium text-amber-600 bg-amber-50 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-amber-200">
            <Timer className="w-4 h-4" /> 
            Mohon tunggu {lockoutTime} detik lagi...
          </div>
        )}
        
        {!captchaToken && lockoutTime === 0 && (
          <div className="mb-4 text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
            <ShieldAlert className="w-3 h-3 text-slate-400" /> 
            Lengkapi verifikasi keamanan untuk masuk
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={isButtonDisabled}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium transition-all 
            ${isButtonDisabled 
              ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 active:scale-95 shadow-sm'}`}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className={`w-5 h-5 ${isButtonDisabled ? 'opacity-50 grayscale' : ''}`} alt="Google" />
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;