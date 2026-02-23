import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Home, 
  Menu, 
  X, 
  Search, 
  Sparkles,
  CheckCircle2,
  Star,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Heart,
  BrainCircuit,
  Loader2,
  AlertCircle,
  Share,
  CalendarCheck,
  Award,
  TicketPercent,
  XCircle,
  CheckCircle,
  User,
  Gift,
  Megaphone,
  Check,
  Activity,
  Quote,
  GitCompare,
  Moon,
  Wind,
  Trophy,
  Music,
  PauseCircle,
  PlayCircle,
  SkipForward,
  Box,
  Dna,
  Smile,
  Disc,
  ArrowRight,
  Download,
  Bot,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Smartphone
} from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product, ViewState, CartItem } from './types';
import GeminiAdvisor from './components/GeminiAdvisor';

// -- Helper Components --

const NavButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      active 
        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-cyan-600'
    }`}
  >
    {icon}
    <span className="font-medium text-sm md:text-base">{label}</span>
  </button>
);

const StarRating: React.FC<{ rating: number; count?: number; size?: number; className?: string }> = ({ rating, count, size = 16, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
           <Star
             key={star}
             size={size}
             className={`${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} transition-colors`}
           />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-slate-400 mr-1">({count})</span>}
    </div>
  );
};

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      if (total > 0) {
        setWidth((current / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 bg-cyan-600 z-[60] transition-all duration-100 ease-out" style={{ width: `${width}%` }}></div>
  );
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      onClick={scrollToTop} 
      className={`fixed bottom-6 right-6 p-3 bg-slate-800 text-white rounded-full shadow-lg z-40 transition-all duration-300 hover:bg-slate-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <ChevronUp size={24} />
    </button>
  );
};

// -- PWA Install Component (Persistent Button) --
const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) {
      setShowButton(false);
      return;
    }

    // Always show button on iOS if not installed (since we can't detect "can install" event)
    if (isIosDevice) {
      setShowButton(true);
    }

    // Android/Chrome event
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setShowButton(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!showButton && !showIOSInstructions) return null;

  return (
    <>
      {/* Floating Install Button */}
      {showButton && (
        <div className="fixed bottom-24 left-4 z-40 animate-bounce-in">
          <button
            onClick={handleInstallClick}
            className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 hover:bg-slate-800 transition-all border border-slate-700/50 backdrop-blur-sm group"
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Download size={20} className="text-white" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-medium">نسخه وب اپلیکیشن</span>
              <span className="block font-bold text-sm">نصب برنامه</span>
            </div>
          </button>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowIOSInstructions(false)}>
           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowIOSInstructions(false)} className="absolute top-4 left-4 text-slate-400"><X /></button>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                 <Share size={32} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2 text-center">راهنمای نصب در آیفون</h3>
              <p className="text-center text-slate-500 text-sm mb-6">برای دسترسی آسان‌تر، وب‌اپلیکیشن را به صفحه اصلی اضافه کنید.</p>
              
              <div className="space-y-4 text-sm text-right bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-slate-600">1</span>
                    <span>دکمه <span className="font-bold text-blue-600">Share</span> (در پایین مرورگر) را بزنید.</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-slate-600">2</span>
                   <span>گزینه <span className="font-bold text-slate-800">Add to Home Screen</span> را انتخاب کنید.</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-slate-600">3</span>
                   <span>دکمه <span className="font-bold text-blue-600">Add</span> را در بالا سمت راست بزنید.</span>
                 </div>
              </div>
              
              <button onClick={() => setShowIOSInstructions(false)} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">متوجه شدم</button>
           </div>
        </div>
      )}
    </>
  );
};

// -- Toast Notification System --

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all animate-bounce-in min-w-[300px] ${
            toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-slate-800' :
            toast.type === 'error' ? 'bg-white border-l-4 border-red-500 text-slate-800' :
            'bg-slate-800 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="text-green-500" size={20} /> :
           toast.type === 'error' ? <XCircle className="text-red-500" size={20} /> :
           <AlertCircle className="text-cyan-400" size={20} />}
          <span className="font-medium text-sm">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="mr-auto text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// -- Component Definitions --

const SpinWheelModal: React.FC<{ onClose: () => void; addToast: (msg: string, type: 'success' | 'error') => void }> = ({ onClose, addToast }) => {
  const [spinning, setSpinning] = useState(false);
  
  const spin = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      addToast("تبریک! کد تخفیف LUCKY10 برنده شدید", "success");
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm text-center relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400"><X /></button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">گردونه شانس</h3>
        <div className={`w-48 h-48 mx-auto rounded-full border-4 border-cyan-500 mb-6 flex items-center justify-center relative overflow-hidden transition-transform duration-[3000ms] ease-out ${spinning ? 'rotate-[1080deg]' : ''}`} style={{ background: 'conic-gradient(from 0deg, #ecfeff 0deg 90deg, #cffafe 90deg 180deg, #a5f3fc 180deg 270deg, #67e8f9 270deg 360deg)' }}>
           <Gift className="text-cyan-600" size={40} />
        </div>
        <button onClick={spin} disabled={spinning} className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold w-full hover:bg-cyan-700 transition-colors">
          {spinning ? 'در حال چرخش...' : 'چرخاندن'}
        </button>
      </div>
    </div>
  );
};

const SubscriptionModal: React.FC<{ onClose: () => void; addToast: (msg: string, type: 'success' | 'error') => void }> = ({ onClose, addToast }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-3xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 left-4 text-slate-400"><X /></button>
         <div className="text-center mb-6">
           <Award className="w-12 h-12 text-amber-500 mx-auto mb-2" />
           <h3 className="text-xl font-bold text-slate-800">اشتراک ویژه</h3>
           <p className="text-slate-500 text-sm">ارسال رایگان + مشاوره اختصاصی</p>
         </div>
         <div className="space-y-3 mb-6">
            <div className="p-4 border-2 border-cyan-500 bg-cyan-50 rounded-2xl flex justify-between items-center cursor-pointer">
               <span className="font-bold text-cyan-900">۳ ماهه</span>
               <span className="font-bold text-cyan-700">۲۹۰,۰۰۰ تومان</span>
            </div>
            <div className="p-4 border border-slate-200 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-50">
               <span className="font-bold text-slate-700">۱ ساله</span>
               <span className="font-bold text-slate-600">۸۹۰,۰۰۰ تومان</span>
            </div>
         </div>
         <button onClick={() => { addToast('در حال حاضر امکان خرید اشتراک وجود ندارد.', 'error'); onClose(); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">انتخاب طرح</button>
      </div>
    </div>
  );
};

const BreathingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phase, setPhase] = useState('دم');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => p === 'دم' ? 'بازدم' : 'دم');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md text-white" onClick={onClose}>
       <div className="text-center" onClick={e => e.stopPropagation()}>
          <h3 className="text-2xl font-bold mb-8">تمرین تنفس</h3>
          <div className={`w-48 h-48 mx-auto rounded-full bg-cyan-500/30 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${phase === 'دم' ? 'scale-125 bg-cyan-400/50' : 'scale-75 bg-cyan-600/20'}`}>
             <div className="text-xl font-bold">{phase}</div>
          </div>
          <p className="mt-8 text-slate-400 text-sm">برای آرامش و کاهش استرس</p>
          <button onClick={onClose} className="mt-8 px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">پایان</button>
       </div>
    </div>
  );
};

const GiftCardModal: React.FC<{ onClose: () => void; addToast: (msg: string, type: 'success' | 'error') => void }> = ({ onClose, addToast }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
       <div className="bg-white p-6 rounded-3xl w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 left-4 text-slate-400"><X /></button>
          <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">ارسال هدیه</h3>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-pink-200">
             <div className="flex justify-between items-start mb-8">
               <Gift size={32} />
               <span className="font-bold text-lg">۵۰۰,۰۰۰ تومان</span>
             </div>
             <p className="text-sm opacity-90">هدیه‌ای برای سلامتی و زیبایی</p>
          </div>
          <button onClick={() => { addToast('لینک هدیه کپی شد!', 'success'); onClose(); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">خرید و ارسال</button>
       </div>
    </div>
  );
};

const InteractionCheckerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
       <div className="bg-white p-6 rounded-3xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 left-4 text-slate-400"><X /></button>
          <div className="flex items-center gap-2 mb-4">
             <Activity className="text-orange-500" />
             <h3 className="text-xl font-bold text-slate-800">بررسی تداخل</h3>
          </div>
          <p className="text-slate-600 mb-6 text-sm">دو یا چند محصول را انتخاب کنید تا تداخل مصرف آن‌ها بررسی شود.</p>
          <div className="bg-slate-50 p-4 rounded-xl text-center text-slate-400 mb-6 border border-dashed border-slate-300">
             هنوز محصولی انتخاب نکرده‌اید
          </div>
          <button onClick={onClose} className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">بازگشت</button>
       </div>
    </div>
  );
};

const TopBanner: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      <p>ارسال رایگان برای خریدهای بالای ۲ میلیون تومان</p>
    </div>
    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={14} /></button>
  </div>
);

const BodyExplorer: React.FC<{ onSelectCategory: (cat: string) => void }> = ({ onSelectCategory }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
       <Dna className="text-cyan-600" size={20} />
       کاوشگر بدن
     </h3>
     <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        <button onClick={() => onSelectCategory('beauty')} className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl hover:bg-slate-50 transition-colors">
           <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500"><Smile size={24} /></div>
           <span className="text-xs font-bold text-slate-600">پوست</span>
        </button>
        <button onClick={() => onSelectCategory('health')} className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl hover:bg-slate-50 transition-colors">
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500"><Heart size={24} /></div>
           <span className="text-xs font-bold text-slate-600">قلب</span>
        </button>
        <button onClick={() => onSelectCategory('vitality')} className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl hover:bg-slate-50 transition-colors">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500"><BrainCircuit size={24} /></div>
           <span className="text-xs font-bold text-slate-600">مغز</span>
        </button>
        <button onClick={() => onSelectCategory('health')} className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl hover:bg-slate-50 transition-colors">
           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500"><Activity size={24} /></div>
           <span className="text-xs font-bold text-slate-600">روده</span>
        </button>
     </div>
  </div>
);

const DailyCheckIn: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
         <CalendarCheck className="text-cyan-600" size={20} />
         چک‌لیست روزانه
       </h3>
       <div 
         className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cyan-300'}`}
         onClick={() => setChecked(!checked)}
       >
         <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${checked ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}>
               {checked && <Check size={14} />}
            </div>
            <span className={`font-bold ${checked ? 'text-green-700' : 'text-slate-600'}`}>مصرف مکمل‌های صبح</span>
         </div>
       </div>
    </div>
  );
};

const AffirmationWidget: React.FC = () => (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg h-full flex flex-col justify-center relative overflow-hidden">
     <Quote size={40} className="absolute top-4 right-4 text-white/20" />
     <p className="text-lg font-bold leading-relaxed relative z-10">
       "تو لایق بهترین‌ها هستی. امروز روز توست تا بدرخشی."
     </p>
     <div className="mt-4 flex items-center gap-2 text-white/60 text-xs">
        <Sparkles size={12} />
        <span>پیام روزانه کائنات</span>
     </div>
  </div>
);

const ZenPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
         <Music className="text-cyan-600" size={20} />
         آوای آرامش
       </h3>
       <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cyan-400">
             <Wind size={20} />
          </div>
          <div className="flex-1">
             <h4 className="font-bold text-sm">صدای طبیعت</h4>
             <p className="text-xs text-slate-400">فرکانس ۴۳۲ هرتز</p>
          </div>
          <button onClick={() => setPlaying(!playing)} className="text-white hover:text-cyan-400 transition-colors">
             {playing ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
          </button>
       </div>
    </div>
  );
};

const MoodTracker: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const moods = ['😊', '😐', '😔', '😫', '🤩'];
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
         <Smile className="text-cyan-600" size={20} />
         حال امروزت چطوره؟
       </h3>
       <div className="flex justify-between">
          {moods.map(m => (
            <button 
              key={m} 
              onClick={() => setMood(m)}
              className={`text-2xl p-2 rounded-xl transition-transform hover:scale-125 ${mood === m ? 'bg-cyan-50 scale-110' : ''}`}
            >
              {m}
            </button>
          ))}
       </div>
    </div>
  );
};

const ChallengeTracker: React.FC = () => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
       <Trophy className="text-amber-500" size={20} />
       چالش ۳۰ روزه
     </h3>
     <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
           <span>روز ۱۲ از ۳۰</span>
           <span>۴۰٪</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[40%] rounded-full"></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">نوشیدن ۸ لیوان آب در روز</p>
     </div>
  </div>
);

const SleepCalculator: React.FC = () => (
  <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg h-full">
     <h3 className="font-bold mb-4 flex items-center gap-2">
       <Moon className="text-cyan-400" size={20} />
       محاسبه خواب
     </h3>
     <div className="text-center">
        <p className="text-slate-400 text-xs mb-2">اگر الان بخوابی، بهترین زمان بیداری:</p>
        <div className="text-2xl font-bold text-cyan-300">۰۶:۳۰ صبح</div>
        <p className="text-xs text-slate-500 mt-1">(۵ چرخه کامل خواب)</p>
     </div>
  </div>
);

const Testimonials: React.FC = () => (
  <div className="mt-12 mb-8">
     <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">نظرات شما</h3>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                 {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                 "واقعاً از کیفیت محصولات راضی هستم. پوستم بعد از یک ماه استفاده کاملاً تغییر کرده و شفاف‌تر شده. ممنون از مشاور هوشمند که دقیق راهنمایی کرد."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                 <div>
                    <span className="block font-bold text-sm text-slate-800">سارا محمدی</span>
                    <span className="text-xs text-slate-400">خریدار محصول کلاژن</span>
                 </div>
              </div>
           </div>
        ))}
     </div>
  </div>
);

const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  addToast: (msg: string, type: 'success' | 'error') => void;
  isLoading?: boolean; // New prop
}> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout, addToast, isLoading = false }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const totalPoints = items.reduce((sum, item) => sum + (item.product.points * item.quantity), 0);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SKIN10') {
      setDiscountPercent(10);
      addToast('کد تخفیف با موفقیت اعمال شد!', 'success');
    } else if (couponCode.trim().toUpperCase() === 'LUCKY10') {
      setDiscountPercent(10);
      addToast('کد تخفیف گردونه شانس اعمال شد!', 'success');
    } else {
      addToast('کد تخفیف نامعتبر است.', 'error');
      setDiscountPercent(0);
    }
  };

  return (
    <>
       <div 
         className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={onClose}
       />
       <div className={`fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <ShoppingBag className="text-cyan-600" />
               سبد خرید
               <span className="text-sm font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                 {items.length} محصول
               </span>
             </h2>
             <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors">
               <X size={24} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {items.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                 <ShoppingBag size={64} className="mb-4 opacity-20" />
                 <p className="text-lg font-medium text-slate-500">سبد خرید شما خالی است</p>
                 <button onClick={onClose} className="mt-4 text-cyan-600 font-bold hover:underline">مشاهده محصولات</button>
               </div>
             ) : (
               items.map(item => {
                 const isMaxStock = item.quantity >= item.product.stock;
                 return (
                   <div key={item.product.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                      <div className={`w-24 h-24 rounded-xl ${item.product.imageColor} flex items-center justify-center shrink-0`}>
                         <img src={`https://picsum.photos/seed/${item.product.id}/200/200`} className="w-20 h-20 object-cover mix-blend-overlay opacity-90 rounded-lg" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                         <div>
                           <h3 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h3>
                           <p className="text-xs text-slate-500 mt-1">{item.product.price.toLocaleString('fa-IR')} تومان</p>
                         </div>
                         <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200" dir="ltr">
                               <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-600 disabled:opacity-50" disabled={item.quantity <= 1}>
                                  <Minus size={14} />
                               </button>
                               <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                               <button 
                                 onClick={() => onUpdateQuantity(item.product.id, 1)} 
                                 className="w-7 h-7 flex items-center justify-center hover:bg-white rounded shadow-sm text-slate-600 disabled:opacity-50"
                                 disabled={isMaxStock}
                               >
                                  <Plus size={14} />
                               </button>
                            </div>
                            <button onClick={() => onRemove(item.product.id)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
          
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50">
               {/* Coupon Section */}
               <div className="flex gap-2 mb-6">
                 <div className="relative flex-1">
                   <TicketPercent className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="کد تخفیف (مثلا SKIN10)" 
                     className="w-full bg-slate-100 border-none rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-cyan-500"
                     value={couponCode}
                     onChange={e => setCouponCode(e.target.value)}
                   />
                 </div>
                 <button 
                   onClick={applyCoupon}
                   className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-700"
                 >
                   اعمال
                 </button>
               </div>

               <div className="space-y-2 mb-4 text-sm">
                 <div className="flex justify-between text-slate-500">
                   <span>جمع جزء</span>
                   <span>{subtotal.toLocaleString('fa-IR')} تومان</span>
                 </div>
                 {discountPercent > 0 && (
                   <div className="flex justify-between text-green-600">
                     <span>تخفیف ({discountPercent}٪)</span>
                     <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                   <span className="font-bold text-slate-800">مبلغ قابل پرداخت</span>
                   <span className="text-xl font-bold text-cyan-700">{total.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">تومان</span></span>
                 </div>
               </div>

               {/* Loyalty Points Summary */}
               <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-orange-100 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-orange-500" size={20} />
                    <span className="text-sm font-bold text-orange-800">امتیاز این خرید:</span>
                  </div>
                  <span className="font-bold text-orange-600">{totalPoints} امتیاز</span>
               </div>

               <button 
                 onClick={onCheckout} 
                 disabled={isLoading}
                 className="w-full py-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="animate-spin" size={20} />
                     در حال انتقال به درگاه...
                   </>
                 ) : (
                   <>
                     <CreditCard size={20} />
                     تکمیل خرید
                   </>
                 )}
               </button>
            </div>
          )}
       </div>
    </>
  )
}

const Stories: React.FC = () => {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  
  const stories = [
    { id: 1, title: 'روتین صبح', img: 'https://picsum.photos/seed/story1/100/100', content: 'https://picsum.photos/seed/story1_large/400/800', type: 'image' },
    { id: 2, title: 'رضایت شما', img: 'https://picsum.photos/seed/story2/100/100', content: 'https://picsum.photos/seed/story2_large/400/800', type: 'image' },
    { id: 3, title: 'محصول جدید', img: 'https://picsum.photos/seed/story3/100/100', content: 'https://picsum.photos/seed/story3_large/400/800', type: 'image' },
    { id: 4, title: 'پشت صحنه', img: 'https://picsum.photos/seed/story4/100/100', content: 'https://picsum.photos/seed/story4_large/400/800', type: 'image' },
  ];

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-6 no-scrollbar">
        {stories.map((story, index) => (
          <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group" onClick={() => setActiveStory(index)}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-600">{story.title}</span>
          </div>
        ))}
      </div>

      {activeStory !== null && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
           <div className="relative w-full max-w-md h-full md:h-[90vh] bg-slate-900 md:rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/30 z-20 flex gap-1 p-2">
                 {stories.map((_, i) => (
                   <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-300 ${i <= activeStory ? 'bg-white' : 'bg-white/30'}`}></div>
                 ))}
              </div>
              <img src={stories[activeStory].content} className="w-full h-full object-cover" alt="Story" />
              <button onClick={() => setActiveStory(null)} className="absolute top-4 right-4 text-white z-30 p-2"><X size={24} /></button>
              
              <div className="absolute inset-y-0 left-0 w-1/2 z-10" onClick={() => setActiveStory(s => (s !== null && s > 0 ? s - 1 : null))}></div>
              <div className="absolute inset-y-0 right-0 w-1/2 z-10" onClick={() => setActiveStory(s => (s !== null && s < stories.length - 1 ? s + 1 : null))}></div>
              
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
                 <h3 className="font-bold text-lg">{stories[activeStory].title}</h3>
                 <p className="text-sm opacity-80">همین حالا ببینید!</p>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

// -- Main App Component --

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [showInteraction, setShowInteraction] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          addToast(`${product.name} به سبد خرید اضافه شد`, 'success');
          return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
          addToast('موجودی محصول کافی نیست', 'error');
          return prev;
        }
      }
      addToast(`${product.name} به سبد خرید اضافه شد`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= item.product.stock) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
    addToast('محصول از سبد حذف شد', 'info');
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setIsCartOpen(false);
      setCart([]);
      setShowSpinWheel(true); 
      addToast('خرید با موفقیت انجام شد!', 'success');
    }, 2000);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory ? p.category === activeCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.subtitle.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-0">
      <ScrollProgress />
      <BackToTop />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <InstallPWA />

      {/* Modals */}
      {showSpinWheel && <SpinWheelModal onClose={() => setShowSpinWheel(false)} addToast={(m, t) => addToast(m, t)} />}
      {showSubscription && <SubscriptionModal onClose={() => setShowSubscription(false)} addToast={(m, t) => addToast(m, t)} />}
      {showBreathing && <BreathingModal onClose={() => setShowBreathing(false)} />}
      {showGiftCard && <GiftCardModal onClose={() => setShowGiftCard(false)} addToast={(m, t) => addToast(m, t)} />}
      {showInteraction && <InteractionCheckerModal onClose={() => setShowInteraction(false)} />}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        addToast={(m, t) => addToast(m as any, t as any)}
        isLoading={checkoutLoading}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row overflow-hidden animate-scale-up">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 z-20 bg-white/50 backdrop-blur p-2 rounded-full hover:bg-white transition-colors"><X /></button>
              
              <div className={`w-full md:w-1/2 ${selectedProduct.imageColor} p-12 flex items-center justify-center relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                 <img src={`https://picsum.photos/seed/${selectedProduct.id}/500/500`} className="w-64 h-64 object-cover rounded-2xl shadow-2xl mix-blend-overlay opacity-90 relative z-10 transform hover:scale-105 transition-transform duration-500" alt={selectedProduct.name} />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col">
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{selectedProduct.category.toUpperCase()}</span>
                      <StarRating rating={selectedProduct.rating} count={selectedProduct.reviews} />
                   </div>
                   <h2 className="text-3xl font-bold text-slate-800 mb-1">{selectedProduct.name}</h2>
                   <p className="text-lg text-slate-500 mb-6">{selectedProduct.subtitle}</p>
                   
                   <p className="text-slate-600 leading-relaxed mb-6">{selectedProduct.description}</p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl">
                         <span className="block text-xs text-slate-400 mb-1">زمان مصرف</span>
                         <span className="font-bold text-sm text-slate-700">{selectedProduct.timing}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                         <span className="block text-xs text-slate-400 mb-1">دوره مصرف</span>
                         <span className="font-bold text-sm text-slate-700">{selectedProduct.duration}</span>
                      </div>
                   </div>

                   <h4 className="font-bold text-slate-800 mb-2">فواید اصلی:</h4>
                   <ul className="space-y-2 mb-8">
                      {selectedProduct.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                           <CheckCircle2 size={16} className="text-cyan-500" />
                           {b}
                        </li>
                      ))}
                   </ul>
                 </div>

                 <div className="border-t border-slate-100 pt-6 flex items-center justify-between gap-4">
                    <div>
                       <span className="block text-2xl font-bold text-slate-800">{selectedProduct.price.toLocaleString('fa-IR')}</span>
                       <span className="text-xs text-slate-400">تومان</span>
                    </div>
                    <button 
                      onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                       <ShoppingBag size={20} />
                       افزودن به سبد
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showBanner && <TopBanner onClose={() => setShowBanner(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
         <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button className="md:hidden p-2 text-slate-600"><Menu /></button>
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 cursor-pointer" onClick={() => setView('home')}>
                 UnderSkin
               </h1>
            </div>

            <nav className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1 rounded-full">
               <NavButton active={view === 'home'} onClick={() => setView('home')} icon={<Home size={18} />} label="خانه" />
               <NavButton active={view === 'products'} onClick={() => setView('products')} icon={<ShoppingBag size={18} />} label="فروشگاه" />
               <NavButton active={view === 'assistant'} onClick={() => setView('assistant')} icon={<Bot size={18} />} label="مشاور هوشمند" />
            </nav>

            <div className="flex items-center gap-3">
               <button onClick={() => setView('assistant')} className="md:hidden p-2 text-slate-600"><Bot /></button>
               <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <ShoppingBag size={24} />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                      {cart.length}
                    </span>
                  )}
               </button>
            </div>
         </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
         {view === 'home' && (
           <div className="space-y-12 animate-fade-in">
              {/* Hero */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                 
                 <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold mb-6 border border-white/10 text-cyan-300">
                      ✨ نسل جدید مکمل‌های زیبایی
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                      بهترین نسخه خودت رو <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">کشف کن</span>
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
                      محصولاتی با فرمولاسیون علمی برای درخشش پوست، افزایش انرژی و سلامتی پایدار. همین حالا مشاوره رایگان بگیر.
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <button onClick={() => setView('products')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-cyan-50 transition-colors shadow-lg shadow-white/10">
                         مشاهده محصولات
                       </button>
                       <button onClick={() => setView('assistant')} className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2">
                         <Bot size={20} />
                         مشاوره هوشمند
                       </button>
                    </div>
                 </div>
              </div>

              <Stories />

              <BodyExplorer onSelectCategory={(cat) => { setActiveCategory(cat); setView('products'); }} />

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-6">
                    <DailyCheckIn />
                    <AffirmationWidget />
                 </div>
                 <div className="space-y-6">
                    <ZenPlayer />
                    <MoodTracker />
                 </div>
                 <div className="space-y-6">
                    <ChallengeTracker />
                    <SleepCalculator />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button onClick={() => setShowSpinWheel(true)} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                       <Disc size={24} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">گردونه شانس</span>
                 </button>
                 <button onClick={() => setShowSubscription(true)} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                       <Box size={24} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">بسته اشتراکی</span>
                 </button>
                 <button onClick={() => setShowInteraction(true)} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                       <GitCompare size={24} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">تداخل سنج</span>
                 </button>
                 <button onClick={() => setShowGiftCard(true)} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                       <Gift size={24} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">کارت هدیه</span>
                 </button>
              </div>

              {/* Featured Products Preview */}
              <div>
                 <div className="flex justify-between items-end mb-6">
                    <div>
                       <h3 className="text-2xl font-bold text-slate-800">محبوب‌ترین‌ها</h3>
                       <p className="text-slate-500">انتخاب مشتریان ما</p>
                    </div>
                    <button onClick={() => setView('products')} className="text-cyan-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                       مشاهده همه <ArrowRight size={18} className="rotate-180" />
                    </button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRODUCTS.slice(0, 4).map(product => (
                       <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                          <div className={`aspect-square rounded-2xl ${product.imageColor} mb-4 flex items-center justify-center relative overflow-hidden`}>
                             <img src={`https://picsum.photos/seed/${product.id}/300/300`} className="w-4/5 h-4/5 object-cover mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                             {product.stock <= 5 && product.stock > 0 && (
                               <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                                 فقط {product.stock} عدد
                               </span>
                             )}
                          </div>
                          <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-slate-500 mb-3">{product.subtitle}</p>
                          <div className="flex items-center justify-between">
                             <span className="font-bold text-slate-800">{product.price.toLocaleString('fa-IR')} <span className="text-[10px] text-slate-400">تومان</span></span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                               className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-lg shadow-slate-200"
                             >
                               <Plus size={16} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <Testimonials />
           </div>
         )}

         {view === 'products' && (
           <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">فروشگاه</h2>
                    <p className="text-slate-500">همه محصولات سلامتی</p>
                 </div>
                 
                 <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${!activeCategory ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>همه</button>
                    <button onClick={() => setActiveCategory('beauty')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === 'beauty' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>زیبایی</button>
                    <button onClick={() => setActiveCategory('health')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === 'health' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>سلامت</button>
                    <button onClick={() => setActiveCategory('vitality')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === 'vitality' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>انرژی</button>
                 </div>
              </div>

              {/* Search */}
              <div className="relative mb-8">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="جستجو در محصولات..." 
                   className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                       <div className={`aspect-square rounded-2xl ${product.imageColor} mb-4 flex items-center justify-center relative overflow-hidden`}>
                          <img src={`https://picsum.photos/seed/${product.id}/400/400`} className="w-3/4 h-3/4 object-cover mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                               <span className="bg-white text-slate-900 px-3 py-1 rounded-lg font-bold text-sm">ناموجود</span>
                            </div>
                          )}
                       </div>
                       <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-slate-500">{product.subtitle}</p>
                          </div>
                          <StarRating rating={product.rating} />
                       </div>
                       
                       <p className="text-slate-600 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                       
                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div>
                             <span className="block font-bold text-lg text-slate-800">{product.price.toLocaleString('fa-IR')}</span>
                          </div>
                          <button 
                             disabled={product.stock === 0}
                             onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                             className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                             <Plus size={16} />
                             افزودن
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         )}

         {view === 'assistant' && (
           <div className="animate-slide-up-fade">
              <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-cyan-200">
                    <Sparkles size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">مشاور هوشمند</h2>
                 <p className="text-slate-500">هر سوالی داری بپرس، من اینجام!</p>
              </div>
              <GeminiAdvisor />
           </div>
         )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-4 flex justify-between items-center z-30 pb-safe">
         <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-cyan-600' : 'text-slate-400'}`}>
            <Home size={24} className={view === 'home' ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold">خانه</span>
         </button>
         <button onClick={() => setView('products')} className={`flex flex-col items-center gap-1 ${view === 'products' ? 'text-cyan-600' : 'text-slate-400'}`}>
            <ShoppingBag size={24} className={view === 'products' ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold">فروشگاه</span>
         </button>
         <div className="relative -mt-8">
            <button onClick={() => setIsCartOpen(true)} className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-300">
               <ShoppingBag size={24} />
               {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cart.length}
                  </span>
               )}
            </button>
         </div>
         <button onClick={() => setView('assistant')} className={`flex flex-col items-center gap-1 ${view === 'assistant' ? 'text-cyan-600' : 'text-slate-400'}`}>
            <Bot size={24} className={view === 'assistant' ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold">مشاور</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <User size={24} />
            <span className="text-[10px] font-bold">پروفایل</span>
         </button>
      </div>
    </div>
  );
};

export default App;