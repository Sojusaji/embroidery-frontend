import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowRight, RefreshCw, Star, User } from 'lucide-react';
import {
  useUserLogin,
  useUserRegistration,
  useSendOtp,
  useVerifyUser,
  useGoogleLogin
} from "../hook/auth/userAuth";
import { useNavigate, useLocation } from 'react-router-dom';




export default function LoginPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search)
  const returnTo = params.get('returnTo') || '/';
  const error = params.get('error');

  const [step, setStep] = useState('identifier');
  const [email, setEmail] = useState('');


  const [fullName, setFullName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);


  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isOtpResending, setIsOtpResending] = useState(false);
  const otpRefs = useRef([]);


  const { mutateAsync: sendOtp, isPending: isOtpSendPending } = useSendOtp();

  const { mutateAsync: verifyUser, isPending: isVerifyUserPending } = useVerifyUser();

  const { mutateAsync: createUser, isPending: isCreateUserPending } = useUserRegistration();

  const { mutateAsync: userLogin, isPending: isUserLoginPending } = useUserLogin();

  const { mutateAsync: googleLogin, isPending: isGoogleLoginPending } = useGoogleLogin();



  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;


    try {

      console.log('emailToVerifying:', email);
      const response = await verifyUser({ email });
      console.log('response from verifyUser', response);


      if (!response?.exists) {
        setIsNewUser(true);
        setStep('register');
      } else {
        setIsNewUser(false);
        console.log('ready to work otp sending hook:', email)
        await sendOtp({ email });

        resetOtpTimer();
        setStep('otp');
      }

    } catch (error) {
      console.error("Authentication handshake initialization failed:", error);
    }
  };



  /* --- Framer Motion Loader Spinner --- */
  const framerMotionSpinner = () => {
    return (
      <motion.div
        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 0.8
        }}
      />
    )
  }



  // Step 2 Trigger: Handle Registration Details Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    try {

      let userData = { name: fullName, email };

      const response = await createUser({ userData })

      if (response?.success) {
        await sendOtp({ email });
        resetOtpTimer();
        setStep('otp')
      }

    } catch (error) {
      console.error("Registration intent submission failed:", error);
    }
  };

  // Single character matrix shift validation
  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return false;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);


    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };


  // Native mobile full token clipboard paste interception handler
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();


    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      otpRefs.current[5].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    console.log('e:', e);
    console.log('index:', index);
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        let newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpRefs.current[index - 1].focus();
      } else {
        let newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Final Step Trigger: Verify Active Token
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    if (finalOtp.length < 6) return;

    try {
      let userData = {
        email,
        otp: finalOtp
      }
      await userLogin({ userData });
      resetOtpTimer();
      navigate(returnTo, { replace: true })

    } catch (error) {
      console.error("Authentication challenge failed rejection:", error);
    }
  };


  const resetOtpTimer = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
  };

  // Handle step backing navigation state updates safely
  const handleBackNavigation = (targetStep) => {
    resetOtpTimer();
    setStep(targetStep);
  };



  useEffect(() => {
    let interval = null;

    if (step === 'otp') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  const handleResendOtp = async () => {
    await sendOtp({ email });
    resetOtpTimer();
    otpRefs.current[0]?.focus();
  };


  // const handleGoogleRedirect = () => {
  //   window.location.href = `${API_BASE_URL}api/v1/auth/users/google?returnTo=${encodeURIComponent(returnTo)}`;
  // }





  return (
    <div className="login relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* Hidden hook node for native fallback activation */}
      <div id="hiddenGoogleTrigger" className="hidden" />
      {/* 🌌 Ambient Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-dark/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Main Structural Layout Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative z-10 min-h-[550px]"
      >

        {/* LEFT COMPONENT: Branding Frame */}
        <div className="hidden md:flex md:col-span-5 bg-white/[0.02] border-r border-white/5 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold tracking-wider uppercase text-gray-200">Bespoke Hub</span>
          </div>

          <div className="space-y-4 my-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 leading-tight">
              Crafting <br />Your Personal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                Experience
              </span>
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Access your custom dimensions, tailored blueprints, and active ordering boards instantly.
            </p>
          </div>

          <div className="text-xs text-gray-400">
            <span>© 2026 Crafted Elegance</span>
          </div>
        </div>

        {/* RIGHT COMPONENT: Form Step Controller Container */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-12 flex flex-col justify-center relative">

          <AnimatePresence mode="wait">

            {/* STEP 1: IDENTIFIER VIEW */}
            {step === 'identifier' && (
              <motion.div
                key="identifier-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h1>
                  <p className="text-sm text-gray-300">Enter your details to sign in or create a new account.</p>
                </div>

                <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                      Email
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="name@email.com "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/15 rounded-2xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <motion.div whileTap={!isVerifyUserPending ? { scale: 0.95 } : {}}>
                    <button
                      type="submit"
                      disabled={isVerifyUserPending}
                      className="w-full flex items-center gap-2 justify-center px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02] cursor-pointer disabled:cursor-not-allowed text-sm min-h-[48px]"
                    >{
                        isVerifyUserPending ? (
                          framerMotionSpinner()
                        ) : (
                          <>
                            Continue
                            < ArrowRight className="w-4 h-4" />
                          </>
                        )

                      }
                    </button>
                  </motion.div>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">or</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                   <button
                    type="button"
                    disabled={isGoogleLoginPending}
                    className="w-full flex items-center gap-3 justify-center px-6 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-semibold rounded-full transition-all cursor-pointer"
                  > {
                      isGoogleLoginPending ? (
                        framerMotionSpinner()
                      ) : (<>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </>)
                    }

                  </button> 
                </motion.div>
              </motion.div>
            )}

            {/* STEP 2: DYNAMIC NEW USER REGISTRATION PANEL */}
            {step === 'register' && (
              <motion.div
                key="register-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold tracking-wide">
                    New Account
                  </span>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mt-3 mb-2">Create your profile</h1>
                  <p className="text-sm text-gray-300">It looks like you're new here. Tell us your name to get started.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/15 rounded-2xl text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 opacity-60">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                      Contact Anchor (Fixed)
                    </label>
                    <input
                      type="text"
                      value={email}
                      disabled
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-gray-300 cursor-not-allowed text-sm"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <motion.div whileTap={isCreateUserPending ? { scale: 0.95 } : {}}>
                      <button
                        type="submit"
                        disabled={isCreateUserPending}
                        className="w-full flex items-center gap-2 justify-center px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02] cursor-pointer disabled:cursor-not-allowed text-sm min-h-[48px]"
                      >{
                          isCreateUserPending ?
                            framerMotionSpinner() :
                            <>
                              Request verification code
                              <ArrowRight className="w-4 h-4" />
                            </>
                        }

                      </button>
                    </motion.div>

                    <button
                      type="button"
                      onClick={() => handleBackNavigation('identifier')}
                      className="w-full text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      Back to input correction
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: OTP VERIFICATION VIEW */}
            {step === 'otp' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    {isNewUser ? 'Verify your account' : 'Security check'}
                  </h1>
                  <p className="text-sm text-gray-300">
                    We've sent a 6-digit secure code to <span className="text-primary font-semibold">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2 max-w-sm mx-auto py-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        ref={(el) => (otpRefs.current[index] = el)}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-14 bg-white/[0.04] border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-xl text-center text-xl font-bold text-primary outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <motion.div whileTap={!isUserLoginPending && !otp.includes('') ? { scale: 0.95 } : {}}>
                      <button
                        type="submit"
                        disabled={otp.includes('') || isUserLoginPending}
                        className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 disabled:bg-white/5 text-white disabled:text-gray-500 font-semibold rounded-full flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed text-sm min-h-[48px]"
                      >
                        {isUserLoginPending ?
                          framerMotionSpinner()
                          : (
                            isNewUser ? 'Complete registration' : 'Verify and sign in'
                          )}
                      </button>
                    </motion.div>

                    <button
                      type="button"
                      onClick={() => handleBackNavigation(isNewUser ? 'register' : 'identifier')}
                      className="w-full text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      Back to info review
                    </button>
                  </div>
                </form>

                <div className="text-center pt-4 border-t border-white/10">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <motion.div
                        animate={isOtpResending ? { rotate: 360 } : { rotate: 0 }}
                        transition={{
                          repeat: isOtpResending ? Infinity : 0,
                          ease: "linear",
                          duration: 1
                        }}
                        className="flex items-center justify-center"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </motion.div>
                      Resend code
                    </button>
                  ) : (
                    <p className="text-xs font-medium text-gray-400">
                      Didn't receive the code? Resend in <span className="text-white font-mono font-bold">{timer}s</span>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}