import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Clock3,
  Code2,
  Command,
  Flame,
  Home,
  Layers3,
  LineChart,
  LockKeyhole,
  Mail,
  Menu,
  Moon,
  Play,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  UserRound,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { cn } from './lib/utils.js';
import { generateCourse, getCurrentCourse, getProfile, loginUser, registerUser, saveProfile } from './services/api.js';

const getSavedPath = () => {
  try {
    const data = localStorage.getItem('learnpath-generated');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const modules = [
  { title: 'Foundations and Mental Models', difficulty: 'Beginner', duration: '2h 40m', progress: 0 },
  { title: 'Applied Practice Lab', difficulty: 'Intermediate', duration: '4h 10m', progress: 0 },
  { title: 'Portfolio Project Sprint', difficulty: 'Advanced', duration: '6h 20m', progress: 0 },
  { title: 'Interview and Mastery Review', difficulty: 'Advanced', duration: '3h 15m', progress: 0 },
];

const navItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Generate Course', path: '/generate', icon: Wand2 },
  { label: 'Learning Dashboard', path: '/learning', icon: LineChart },
  { label: 'Course', path: '/course', icon: BookOpen },
  { label: 'Projects', path: '/projects', icon: Rocket },
  { label: 'Interview Prep', path: '/interview', icon: BrainCircuit },
  { label: 'Analytics', path: '/analytics', icon: LineChart },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const homeStats = [
  { label: 'Course Progress', value: '0%', icon: BookOpen, tone: 'from-indigo-500 to-violet-500' },
  { label: 'Completed Lessons', value: '0', icon: CheckCircle2, tone: 'from-emerald-500 to-cyan-400' },
  { label: 'Learning Streak', value: '0 Days', icon: Flame, tone: 'from-amber-400 to-orange-500' },
  { label: 'Projects Completed', value: '0', icon: Rocket, tone: 'from-sky-500 to-indigo-500' },
  { label: 'Interview Readiness', value: 'Not Available', icon: BrainCircuit, tone: 'from-violet-500 to-fuchsia-500' },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rise = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('learnpath-theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('learnpath-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
}

function usePointerGlow() {
  const [pos, setPos] = useState({ x: 50, y: 28 });

  function onPointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return {
    onPointerMove,
    style: {
      '--pointer-x': `${pos.x}%`,
      '--pointer-y': `${pos.y}%`,
    },
  };
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <span className={cn('relative inline-grid place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-400 text-white shadow-glow', className)}>
      <svg viewBox="0 0 48 48" className="h-[72%] w-[72%]" fill="none" aria-hidden="true">
        <path d="M12 15.5C12 12.5 14.5 10 17.6 10H24v28h-6.4C14.5 38 12 35.5 12 32.5v-17Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M24 10h6.4c3.1 0 5.6 2.5 5.6 5.5v17c0 3-2.5 5.5-5.6 5.5H24V10Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 18h4M18 24h4M30 18l4 4-4 4M28 31h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="34" cy="22" r="2.2" fill="currentColor" />
        <circle cx="28" cy="31" r="2" fill="currentColor" />
      </svg>
      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-cyan-300 ring-4 ring-white/70 dark:ring-slate-950/70" />
    </span>
  );
}

function BrandLogo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3 font-extrabold text-slate-950 dark:text-white">
      <LogoMark />
      {!compact && (
        <span className="leading-tight">
          LearnPath AI
          <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Agentic Learning</span>
        </span>
      )}
    </Link>
  );
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setDark((value) => !value)}
      className="ripple inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:text-brand-primary dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function PrimaryButton({ children, to, onClick, className }) {
  const content = (
    <span className={cn('btn-primary ripple', className)}>
      {children}
    </span>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return <button onClick={onClick} className="contents">{content}</button>;
}

function PremiumCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      whileHover={{ y: -5, rotateX: 1, rotateY: -1 }}
      className={cn('premium-card', className)}
    >
      {children}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
      ))}
    </span>
  );
}

function ProgressRing({ value = 0 }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid h-36 w-36 shrink-0 place-items-center">
      <svg className="-rotate-90" width="144" height="144" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148, 163, 184, .22)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#4F46E5" />
            <stop offset="0.55" stopColor="#A855F7" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold text-slate-950 dark:text-white">{value}%</p>
        <p className="text-xs font-bold uppercase text-slate-400">progress</p>
      </div>
    </div>
  );
}

function EmptyAnalyticsCard() {
  return (
    <div className="relative grid h-72 place-items-center overflow-hidden rounded-[1.4rem] border border-dashed border-indigo-200 bg-white/45 p-6 text-center dark:border-indigo-400/20 dark:bg-white/5">
      <div className="absolute inset-x-8 top-8 h-16 rounded-2xl shimmer opacity-60" />
      <div className="absolute bottom-9 left-8 right-8 flex items-end justify-center gap-3 opacity-60">
        {[56, 82, 44, 96, 68, 74].map((height, index) => (
          <motion.div
            key={height}
            animate={{ height: [height * 0.55, height, height * 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.12 }}
            className="w-8 rounded-t-xl bg-gradient-to-t from-indigo-500/20 to-cyan-400/45"
          />
        ))}
      </div>
      <div className="relative z-10 max-w-sm rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <LineChart className="mx-auto text-brand-primary" size={28} />
        <p className="mt-3 font-bold text-slate-950 dark:text-white">Start your first course to unlock analytics.</p>
      </div>
    </div>
  );
}

function EmptyJourneyIllustration() {
  return (
    <div className="relative grid min-h-52 w-full max-w-xs place-items-center overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="absolute h-36 w-36 rounded-full bg-gradient-to-br from-amber-200/80 via-cyan-200/60 to-violet-300/60 blur-2xl" />
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative grid h-28 w-28 place-items-center rounded-[1.6rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-400 text-white shadow-glow"
      >
        <BookOpen size={44} />
      </motion.div>
      <div className="relative mt-5 w-full space-y-2">
        {[68, 48, 78].map((width, index) => (
          <div key={width} className="h-2 overflow-hidden rounded-full bg-white/70 dark:bg-white/10">
            <motion.div
              animate={{ width: [`${width * 0.45}%`, `${width}%`, `${width * 0.45}%`] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-violet-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Landing({ dark, setDark }) {
  const pointer = usePointerGlow();
  const navigate = useNavigate();

  function beginLearning() {
    const isAuthenticated = localStorage.getItem('learnpath-auth') === 'true';
    const hasProfile = localStorage.getItem('learnpath-profile') === 'true';

    if (!isAuthenticated) navigate('/login');
    else if (!hasProfile) navigate('/profile');
    else navigate('/dashboard');
  }

  return (
    <PageTransition>
      <div className="launch-bg relative grid min-h-screen overflow-hidden px-4 py-8" {...pointer}>
        <div className="aurora left-[8%] top-[14%] h-64 w-64 rounded-full bg-indigo-300/45" />
        <div className="aurora right-[10%] top-[18%] h-72 w-72 rounded-full bg-cyan-300/35 [animation-delay:1.2s]" />
        <div className="aurora bottom-[16%] left-[36%] h-72 w-72 rounded-full bg-amber-200/45 [animation-delay:2.4s]" />
        <div className="particle-field" />

        <div className="absolute right-5 top-5 z-20">
          <ThemeToggle dark={dark} setDark={setDark} />
        </div>

        <main className="relative z-10 mx-auto grid w-full max-w-3xl place-items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{ opacity: { duration: 0.55 }, scale: { duration: 0.55 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="mb-7"
          >
            <LogoMark className="mx-auto h-24 w-24 rounded-[2rem] shadow-[0_28px_90px_rgba(124,58,237,.36)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="glass max-w-3xl rounded-[2rem] px-6 py-8 sm:px-10"
          >
            <h1 className="text-[38px] font-extrabold leading-tight text-slate-950 sm:text-[52px] dark:text-white">LearnPath AI</h1>
            <p className="mt-3 text-xl font-bold text-gradient animated-gradient sm:text-2xl">One Prompt. Whole Learning.</p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Generate complete AI-powered learning paths, projects, quizzes, and interview preparation from a single prompt.
            </p>
            <motion.button
              onClick={beginLearning}
              whileHover={{ scale: 1.035, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary ripple group mt-8 px-8 py-4 text-base shadow-[0_24px_80px_rgba(124,58,237,.34)]"
            >
              Begin Learning
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                <ArrowRight size={20} />
              </motion.span>
            </motion.button>
          </motion.div>
        </main>

        <Footer minimal />
      </div>
    </PageTransition>
  );
}

function AIHeroIllustration() {
  const agents = ['Profile', 'Curriculum', 'Practice', 'Projects', 'Interview'];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55 }}
      style={{
        background: 'radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 28%), rgba(255,255,255,.95), rgba(255,255,255,.56) 34%, rgba(255,255,255,.38))',
      }}
      className="relative min-h-[470px] overflow-hidden rounded-[2.2rem] border border-white/80 p-5 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,70,229,.18),rgba(56,189,248,.14),rgba(236,72,153,.12))]" />
      <div className="absolute inset-x-8 top-8 rounded-[2rem] bg-slate-950/90 p-4 shadow-soft dark:bg-white/10">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-pink-400" />
            <span className="h-3 w-3 rounded-full bg-orange-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">learning graph active <TypingDots /></span>
        </div>
      </div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-[54%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-300/70" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-[54%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/60" />
      <div className="relative grid h-full min-h-[430px] place-items-center pt-14">
        <motion.div
          animate={{ y: [0, -12, 0], boxShadow: ['0 18px 60px rgba(79,70,229,.28)', '0 28px 90px rgba(217,70,239,.38)', '0 18px 60px rgba(79,70,229,.28)'] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="grid h-36 w-36 place-items-center rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white shadow-glow dark:from-white dark:via-indigo-50 dark:to-violet-100 dark:text-slate-950"
        >
          <LogoMark className="h-16 w-16 shadow-none" />
          <span className="mt-2 text-sm font-bold">Learning Core</span>
        </motion.div>
        {agents.map((agent, index) => {
          const positions = ['left-8 top-24', 'right-8 top-24', 'left-10 bottom-20', 'right-12 bottom-20', 'left-1/2 top-20 -translate-x-1/2'];
          return (
            <motion.div
              key={agent}
              animate={{ y: [0, index % 2 ? 10 : -10, 0], scale: [1, 1.025, 1] }}
              transition={{ duration: 3 + index * 0.25, repeat: Infinity }}
              className={cn('absolute rounded-2xl border border-white/80 bg-white/86 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82', positions[index])}
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white">{agent} Agent</p>
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> ready</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AuthLayout({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      if (isLogin) {
        await loginUser(email, password);
        navigate('/profile');
      } else {
        const name = data.get('name');
        const confirmPassword = data.get('confirmPassword');
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await registerUser(email, password);
        localStorage.setItem('learnpath-user-name', name);
        alert('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Network error, please try again.');
    }
  }

  return (
    <PageTransition>
      <CenteredShell>
        <div className="section grid min-h-screen items-center gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:block">
            <BrandLogo />
            <div className="mt-10 premium-card p-8">
              <p className="font-semibold text-brand-primary">{isLogin ? 'Welcome back' : 'Start with clarity'}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
                Your AI learning team begins after authentication.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                Create a secure account, complete your learning profile, and unlock a personalized home dashboard before generating a course.
              </p>
              <div className="mt-8 space-y-4">
                {['Personalized roadmap generation', 'Projects and quizzes from your level', 'Analytics without fake starter data'].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-400 text-white">
                      <Check size={17} />
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xl">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-primary dark:text-slate-400">
              <ArrowLeft size={16} /> Back to landing
            </Link>
            <div className="premium-card p-6 sm:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <BrandLogo />
                <span className="rounded-full border border-white/70 bg-white/65 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  {isLogin ? 'Login' : 'Sign Up'}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">{isLogin ? 'Login to LearnPath AI' : 'Create your account'}</h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                {isLogin ? 'Authenticate to continue to first-time profile creation.' : 'Sign up to begin your personalized learning setup.'}
              </p>
              <form onSubmit={submit} className="mt-7 space-y-4">
                {!isLogin && <AuthField label="Full Name" name="name" icon={UserRound} placeholder="Sindhu Rao" />}
                <AuthField label="Email" name="email" icon={Mail} type="email" placeholder="you@example.com" />
                <AuthField label="Password" name="password" icon={LockKeyhole} type="password" placeholder="••••••••" />
                {!isLogin && <AuthField label="Confirm Password" name="confirmPassword" icon={ShieldCheck} type="password" placeholder="••••••••" />}
                {isLogin && (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <label className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                      <input type="checkbox" className="h-4 w-4 accent-indigo-600" /> Remember Me
                    </label>
                    <a href="#" className="font-semibold text-brand-primary">Forgot Password?</a>
                  </div>
                )}
                <button className="btn-primary ripple w-full">{isLogin ? 'Login' : 'Create Account'} <ArrowRight size={18} /></button>
                {isLogin && (
                  <button type="button" className="btn-secondary ripple w-full">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-slate-950">G</span>
                    Sign in with Google
                  </button>
                )}
              </form>
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Link to={isLogin ? '/signup' : '/login'} className="font-bold text-brand-primary">
                  {isLogin ? 'Sign Up' : 'Go to Login'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </CenteredShell>
    </PageTransition>
  );
}

function AuthField({ label, name, icon: Icon, type = 'text', placeholder }) {
  return (
    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 focus-within:shadow-glow dark:border-white/10 dark:bg-slate-950/70">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        <Icon size={15} /> {label}
      </span>
      <input type={type} name={name} required placeholder={placeholder} className="mt-2 w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-300 dark:text-white" />
    </label>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    learning_goal: '',
    target_role: '',
    current_skill_level: 'Beginner',
    education: '',
    languages_known: '',
    technologies: '',
    learning_style: 'Project-based',
    daily_study_hours: '2',
    weekly_goal: '',
    target_completion_date: '',
    experience_level: 'None',
    career_objective: '',
    preferred_difficulty: 'Beginner'
  });

  useEffect(() => {
    const token = localStorage.getItem('learnpath-token');
    if (token) {
      getProfile()
        .then(() => navigate('/dashboard'))
        .catch(err => console.error(err));
    }
  }, [navigate]);

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await saveProfile(profile);
      localStorage.setItem('learnpath-user-name', profile.full_name);
      localStorage.setItem('learnpath-topic', profile.learning_goal || profile.target_role || 'AI Engineering');
      navigate('/loading');
    } catch (err) {
      alert(err.response?.data?.detail || err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <CenteredShell>
        <div className="section py-8">
          <div className="mb-8 flex items-center justify-between">
            <BrandLogo />
            <Link to="/login" className="btn-secondary px-4 py-2.5">Logout</Link>
          </div>
          <div className="mx-auto max-w-5xl">
            <p className="font-semibold text-brand-primary">Step {step} of 2 · Progress {step === 1 ? '50%' : '100%'}</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
              Personalize LearnPath AI before your dashboard unlocks.
            </h1>
            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }} className="mt-8 premium-card p-5 sm:p-8">
              <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: step === 1 ? '50%' : '100%' }} transition={{ duration: 0.4 }} className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid gap-4 md:grid-cols-2">
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Full Name</span>
                      <input type="text" name="full_name" required value={profile.full_name} onChange={handleChange} placeholder="Sindhu Rao" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Education</span>
                      <input type="text" name="education" required value={profile.education} onChange={handleChange} placeholder="Bachelor of Science in CS" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Target Role</span>
                      <input type="text" name="target_role" required value={profile.target_role} onChange={handleChange} placeholder="Full Stack AI Engineer" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Target Completion Date</span>
                      <input type="date" name="target_completion_date" required value={profile.target_completion_date} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Experience Level</span>
                      <select name="experience_level" value={profile.experience_level} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
                        <option value="None">No Experience</option>
                        <option value="Junior">Junior (under 2 years)</option>
                        <option value="Mid">Mid-level (2-5 years)</option>
                        <option value="Senior">Senior (5+ years)</option>
                      </select>
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Career Objective</span>
                      <input type="text" name="career_objective" required value={profile.career_objective} onChange={handleChange} placeholder="Build AI products in start-ups" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid gap-4 md:grid-cols-2">
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Primary Learning Goal</span>
                      <input type="text" name="learning_goal" required value={profile.learning_goal} onChange={handleChange} placeholder="Become Python Backend Developer" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Known Programming Languages</span>
                      <input type="text" name="languages_known" required value={profile.languages_known} onChange={handleChange} placeholder="Python, JavaScript, SQL" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Technologies of Interest</span>
                      <input type="text" name="technologies" required value={profile.technologies} onChange={handleChange} placeholder="FastAPI, PyTest, Docker, LangChain" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Preferred Learning Style</span>
                      <select name="learning_style" value={profile.learning_style} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
                        <option value="Project-based">Project-based (Practical Labs)</option>
                        <option value="Visual">Visual (Diagrams & Flow charts)</option>
                        <option value="Theoretical">Reading-intensive (Detailed Docs)</option>
                        <option value="Mixed">Mixed Learning Loop</option>
                      </select>
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Daily Study Hours</span>
                      <input type="text" name="daily_study_hours" required value={profile.daily_study_hours} onChange={handleChange} placeholder="2 hours" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Weekly Goal Target</span>
                      <input type="text" name="weekly_goal" required value={profile.weekly_goal} onChange={handleChange} placeholder="Finish 1 full module" className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Preferred Difficulty</span>
                      <select name="preferred_difficulty" value={profile.preferred_difficulty} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </label>
                    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Current Skill Level</span>
                      <select name="current_skill_level" value={profile.current_skill_level} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex justify-between">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary py-2.5">
                    Back
                  </button>
                )}
                <div className="ml-auto">
                  <button type="submit" disabled={loading} className="btn-primary ripple">
                    {loading ? "Saving..." : step === 1 ? "Next Step" : "Complete Setup"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CenteredShell>
    </PageTransition>
  );
}

function LoadingPage() {
  const navigate = useNavigate();
  const agents = ['Curriculum Agent', 'Content Agent', 'Knowledge Agent', 'Assessment Agent', 'Projects Agent', 'Interview Agent', 'Learning Analytics'];
  const [active, setActive] = useState(0);
  const [apiDone, setApiDone] = useState(false);

  useEffect(() => {
    const topic = localStorage.getItem('learnpath-topic') || 'AI frontend engineering';
    const profile = JSON.parse(localStorage.getItem('learnpath-generation-profile') || '{}');

    generateCourse({
      goal: topic,
      title: `${topic} Learning Path`,
      target_role: profile.target_role,
      skill_level: profile.current_skill_level,
      daily_study_hours: Number(profile.daily_study_hours || 2),
      learning_style: profile.learning_style,
      target_completion_date: profile.target_completion_date,
      favorite_technologies: profile.technologies,
    })
      .then(() => {
        setApiDone(true);
      })
      .catch(err => {
        console.error(err);
        setApiDone(true);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(current => {
        if (current < agents.length - 1) return current + 1;
        if (apiDone) {
          clearInterval(interval);
          navigate('/dashboard');
        }
        return current;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [apiDone, navigate, agents.length]);

  return (
    <PageTransition>
      <CenteredShell>
        <div className="section max-w-xl py-12">
          <div className="text-center">
            <LogoMark className="h-16 w-16" />
            <h1 className="mt-6 text-3xl font-extrabold text-slate-950 dark:text-white">Assembling learning pipeline...</h1>
            <p className="mt-2 text-slate-500">FastAPI backend orchestrating multi-agent context generators.</p>
          </div>
          <div className="mt-8 premium-card p-5 sm:p-6 space-y-4">
            {agents.map((agent, index) => (
              <div key={agent} className={cn('flex items-center justify-between rounded-2xl border p-4 transition duration-300', index === active ? 'border-violet-300 bg-gradient-to-r from-indigo-50/50 to-fuchsia-50/50 dark:bg-white/5' : 'border-white/50 bg-white/30 dark:border-white/5 dark:bg-white/0')}>
                <div className="flex items-center gap-3">
                  <span className={cn('grid h-8 w-8 place-items-center rounded-xl font-bold text-white', index < active ? 'bg-emerald-500' : index === active ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700')}>
                    {index < active ? '✔' : index + 1}
                  </span>
                  <span className={cn('font-semibold', index === active ? 'text-indigo-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400')}>{agent}</span>
                </div>
                {index === active && <span className="text-xs font-bold text-indigo-600 dark:text-violet-400 animate-pulse">Running...</span>}
              </div>
            ))}
          </div>
        </div>
      </CenteredShell>
    </PageTransition>
  );
}

function LoadingModulePage() {
  const navigate = useNavigate();
  const agents = ['Content Agent', 'Knowledge Agent', 'Assessment Agent', 'Projects Agent'];
  const [active, setActive] = useState(0);
  const [apiDone, setApiDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setApiDone(true), 1100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(current => {
        if (current < agents.length - 1) return current + 1;
        if (apiDone) {
          clearInterval(interval);
          const index = localStorage.getItem('learnpath-generate-module-index');
          localStorage.setItem('learnpath-active-module-index', index);
          navigate('/course');
        }
        return current;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [apiDone, navigate, agents.length]);

  return (
    <PageTransition>
      <CenteredShell>
        <div className="section max-w-xl py-12">
          <div className="text-center">
            <LogoMark className="h-16 w-16" />
            <h1 className="mt-6 text-3xl font-extrabold text-slate-950 dark:text-white">Generating module material...</h1>
            <p className="mt-2 text-slate-500">Writing custom lessons, quizzes, resources and project checkpoints.</p>
          </div>
          <div className="mt-8 premium-card p-5 sm:p-6 space-y-4">
            {agents.map((agent, index) => (
              <div key={agent} className={cn('flex items-center justify-between rounded-2xl border p-4 transition duration-300', index === active ? 'border-violet-300 bg-gradient-to-r from-indigo-50/50 to-fuchsia-50/50 dark:bg-white/5' : 'border-white/50 bg-white/30 dark:border-white/5 dark:bg-white/0')}>
                <div className="flex items-center gap-3">
                  <span className={cn('grid h-8 w-8 place-items-center rounded-xl font-bold text-white', index < active ? 'bg-emerald-500' : index === active ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700')}>
                    {index < active ? '✔' : index + 1}
                  </span>
                  <span className={cn('font-semibold', index === active ? 'text-indigo-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400')}>{agent}</span>
                </div>
                {index === active && <span className="text-xs font-bold text-indigo-600 dark:text-violet-400 animate-pulse">Generating...</span>}
              </div>
            ))}
          </div>
        </div>
      </CenteredShell>
    </PageTransition>
  );
}

function HomeDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('learnpath-token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      getProfile().then(data => ({ ok: true, data })).catch(err => ({ ok: false, status: err.response?.status })),
      getCurrentCourse().then(data => ({ ok: true, data })).catch(err => ({ ok: false, status: err.response?.status }))
    ])
      .then(([profileRes, pathRes]) => {
        if (profileRes.status === 404) {
          navigate('/profile');
          return;
        }
        if (profileRes.ok) {
          setProfile(profileRes.data);
        }

        if (pathRes.ok) {
          setPath(pathRes.data);
        } else {
          setPath(null);
          localStorage.removeItem('learnpath-generated');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="grid h-64 place-items-center">
        <CircleDashed size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  const progress = path ? Math.round(path.modules.reduce((acc, m) => acc + (m.progress || 0), 0) / path.modules.length) : 0;
  const completedLessons = path ? path.modules.filter(m => m.progress >= 100).length : 0;
  const completedProjects = path ? path.modules.filter(m => m.progress >= 100).length : 0;
  const learningStreak = path ? 1 : 0;
  const interviewReadiness = path ? `${Math.round(progress * 1.2)}%` : "Not Available";

  const dynamicStats = [
    { label: 'Course Progress', value: `${progress}%`, icon: BookOpen, tone: 'from-indigo-500 to-violet-500' },
    { label: 'Completed Lessons', value: `${completedLessons}`, icon: CheckCircle2, tone: 'from-emerald-500 to-cyan-400' },
    { label: 'Learning Streak', value: `${learningStreak} Days`, icon: Flame, tone: 'from-amber-400 to-orange-500' },
    { label: 'Projects Completed', value: `${completedProjects}`, icon: Rocket, tone: 'from-sky-500 to-indigo-500' },
    { label: 'Interview Readiness', value: interviewReadiness, icon: BrainCircuit, tone: 'from-violet-500 to-fuchsia-500' },
  ];

  if (!path) {
    return (
      <PageTransition>
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
            <PremiumCard className="p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-300/30 blur-3xl" />
              <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-brand-primary">Generate First Course</p>
                  <h1 className="mt-2 max-w-2xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
                    Your learning journey starts here.
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    You have not generated a course yet. Create your first AI-powered path to unlock real progress, lessons, analytics, projects, and interview readiness.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <PrimaryButton to="/generate">Generate Your First Course <Sparkles size={17} /></PrimaryButton>
                    <Link to="/profile" className="btn-secondary ripple">Edit Profile</Link>
                  </div>
                </div>
                <EmptyJourneyIllustration />
              </div>
            </PremiumCard>
            <PremiumCard className="p-6">
              <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Analytics</h2>
              <div className="mt-5"><EmptyAnalyticsCard /></div>
            </PremiumCard>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dynamicStats.map((stat, index) => <Metric key={stat.label} {...stat} delay={index * 0.04} />)}
          </div>
        </motion.div>
      </PageTransition>
    );
  }

  const activeModuleIndex = path.modules.findIndex(m => m.progress < 100);
  const currentModule = activeModuleIndex !== -1 ? path.modules[activeModuleIndex] : path.modules[path.modules.length - 1];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Welcome back, {profile?.full_name || 'Learner'} 👋</h1>
            <p className="text-slate-500">Continue your learning journey.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/generate" className="btn-primary py-2.5">Create New Path <Sparkles size={16} /></Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="premium-card p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Active Roadmap: {path.topic}</h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-brand-primary dark:bg-indigo-500/10">Active</span>
            </div>
            
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <ProgressRing value={progress} />
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Current Focus: {currentModule.title}</h3>
                <p className="text-sm text-slate-500">Difficulty: {currentModule.difficulty} · Duration: {currentModule.duration}</p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div style={{ width: `${currentModule.progress}%` }} className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link to="/course" className="btn-primary py-2.5">Open Course roadmap</Link>
            </div>
          </div>

          <div className="premium-card p-6 space-y-4">
            <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Quick Actions</h2>
            <div className="grid gap-2">
              <Link to="/course" className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 p-3 text-sm font-semibold hover:border-violet-300 dark:border-white/5 dark:bg-white/5">
                <span className="flex items-center gap-3"><BookOpen size={16} className="text-indigo-600" /> Go to Lesson</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/projects" className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 p-3 text-sm font-semibold hover:border-violet-300 dark:border-white/5 dark:bg-white/5">
                <span className="flex items-center gap-3"><Rocket size={16} className="text-emerald-500" /> Complete Projects</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/interview" className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 p-3 text-sm font-semibold hover:border-violet-300 dark:border-white/5 dark:bg-white/5">
                <span className="flex items-center gap-3"><BrainCircuit size={16} className="text-violet-500" /> Mock Interview Prep</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="premium-card p-6 space-y-4">
            <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Today's Goal</h2>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-500/10 dark:bg-sky-500/5">
              <p className="text-sm font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">Active Task</p>
              <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">Study concepts in "{currentModule.title}" and complete Lesson 1.</p>
            </div>
            
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-wider pt-2">AI Recommendation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              "We noticed you are ready to apply foundations. Check out the practice mini lab in Module {activeModuleIndex + 1} to solidify your code structure."
            </p>
          </div>

          <div className="premium-card p-6 space-y-4">
            <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Upcoming Tasks</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 p-3 dark:border-white/5 dark:bg-white/0">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 text-violet-600 text-sm font-bold dark:bg-violet-950 dark:text-violet-300">Q</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Module Quiz</p>
                  <p className="text-xs text-slate-400">Quiz checkpoints for verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 p-3 dark:border-white/5 dark:bg-white/0">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-600 text-sm font-bold dark:bg-emerald-950 dark:text-emerald-300">P</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Mini Project Sprint</p>
                  <p className="text-xs text-slate-400">Implement calculations and API routing</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-wider pt-2">Weekly Target</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Study Goal: **{profile?.daily_study_hours || '2'} hours / day** · Target completion is set for **{profile?.target_completion_date || 'N/A'}**.
            </p>
          </div>

          <div className="premium-card p-6 space-y-4">
            <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Generated Path: {path.topic}</p>
                  <p className="text-xs text-slate-400">Just now</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Profile Setup Completed</p>
                  <p className="text-xs text-slate-400">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dynamicStats.map((stat, index) => <Metric key={stat.label} {...stat} delay={index * 0.04} />)}
        </div>
      </div>
    </PageTransition>
  );
}

function GenerateCoursePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('learnpath-token');
    if (token) {
      getProfile()
        .then(data => setProfile(data))
        .catch(err => console.error(err));
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const topic = data.get('Topic') || 'AI frontend engineering';
    localStorage.setItem('learnpath-topic', topic);
    localStorage.setItem('learnpath-generation-profile', JSON.stringify(profile || {}));
    navigate('/loading');
  }

  return (
    <PageTransition>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <PremiumCard className="p-6 sm:p-8">
          <p className="font-semibold text-brand-primary">Generate Course</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
            👋 Hello {profile?.full_name || 'Learner'}
          </h1>
          <p className="mt-2 text-xl font-bold text-slate-700 dark:text-slate-300">What would you like to learn today?</p>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">The agent team will use your profile settings (Languages: {profile?.languages_known || 'N/A'}, Daily Target: {profile?.daily_study_hours || '2'} hours) to build a custom roadmap.</p>
          
          <div className="mt-7">
            <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 focus-within:shadow-glow dark:border-white/10 dark:bg-slate-950/70">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Generate Learning Path</span>
              <input name="Topic" required placeholder="e.g. Become Python Backend Developer" className="mt-2 w-full bg-transparent text-xl font-bold outline-none dark:text-white placeholder:text-slate-300" />
            </label>
          </div>
          <button type="submit" className="btn-primary ripple mt-7">Generate Course <ArrowRight size={18} /></button>
        </PremiumCard>
        <PremiumCard className="p-6">
          <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Agent Pipeline</h2>
          <div className="mt-5 space-y-4">
            {['Curriculum map', 'Lesson sequence', 'Projects', 'Quizzes', 'Interview prep'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
                <CircleDashed size={18} className="text-brand-primary" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </form>
    </PageTransition>
  );
}

function CoursePage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(0);
  const [path, setPath] = useState(null);

  useEffect(() => {
    const saved = getSavedPath();
    setPath(saved);
  }, []);

  if (!path) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">No active learning path. Generate one to start!</h2>
      </div>
    );
  }

  const activeModules = path.modules;
  const topic = path.topic;

  async function handleAction(index, targetRoute) {
    const module = activeModules[index];
    if (module.lesson && module.quiz) {
      localStorage.setItem('learnpath-active-module-index', index);
      navigate(targetRoute);
    } else {
      localStorage.setItem('learnpath-generate-module-index', index);
      navigate('/loading-module');
    }
  }

  return (
    <PageTransition>
      <PageHeader kicker="Course Roadmap" title={`${topic} roadmap.`} />
      <div className="space-y-5">
        {activeModules.map((module, index) => (
          <motion.article key={module.title} layout whileHover={{ y: -4 }} className="premium-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white shadow-glow">{index + 1}</span>
                <div>
                  <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">{module.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{module.difficulty} · {module.duration} · {module.progress || 0}% complete</p>
                </div>
              </div>
              <ChevronDown className={cn('transition', expanded === index && 'rotate-180')} size={20} />
            </button>
            <AnimatePresence>
              {expanded === index && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200 dark:border-white/10">
                  <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${module.progress || 0}%` }} className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleAction(index, '/lesson')} className="btn-primary py-2 px-4 text-sm">Lesson</button>
                      <button onClick={() => handleAction(index, '/quiz')} className="btn-secondary py-2 px-4 text-sm">Quiz</button>
                      <button onClick={() => handleAction(index, '/projects')} className="btn-secondary py-2 px-4 text-sm">Projects</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
    </PageTransition>
  );
}

function LessonPage() {
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [moduleIndex, setModuleIndex] = useState(0);

  useEffect(() => {
    setPath(getSavedPath());
    const idx = parseInt(localStorage.getItem('learnpath-active-module-index') || '0');
    setModuleIndex(idx);
  }, []);

  if (!path) return null;
  const module = path.modules[moduleIndex];
  const lesson = module.lesson || {
    explanation: "Core concepts explanation",
    examples: "Examples context",
    code_snippet: "print('Hello')",
    tips: "Tip guide details",
    best_practices: "Clean code structure",
    common_mistakes: "Common pits to avoid",
    summary: "Lesson summary"
  };
  const resources = module.resources || [
    { title: "Official Documentation", url: "https://docs.python.org/3/" }
  ];

  function handleComplete() {
    const updatedPath = { ...path };
    updatedPath.modules[moduleIndex].progress = 100;
    localStorage.setItem('learnpath-generated', JSON.stringify(updatedPath));
    setPath(updatedPath);
  }

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <article className="premium-card p-6 sm:p-9 space-y-6">
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${module.progress || 0}%` }} className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
          </div>
          <p className="font-semibold text-brand-primary">Lesson {moduleIndex + 1}.1</p>
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">{module.title}</h1>
          
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p className="text-base leading-8">{lesson.explanation}</p>
          </div>

          <div className="rounded-2xl border border-sky-200/70 bg-sky-50/75 p-5 shadow-cyan backdrop-blur-xl dark:border-sky-400/20 dark:bg-sky-500/10">
            <h2 className="font-bold text-slate-950 dark:text-white">Tip Highlight</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{lesson.tips}</p>
          </div>

          {lesson.code_snippet && (
            <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">
              <code>{lesson.code_snippet}</code>
            </pre>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Best Practices</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.best_practices}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-500/10 dark:bg-rose-500/5">
              <h3 className="font-bold text-rose-800 dark:text-rose-400">Common Mistakes</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.common_mistakes}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 dark:border-white/10">
            <h3 className="font-bold text-slate-950 dark:text-white">Summary</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-6 dark:border-white/10">
            <button disabled={moduleIndex === 0} onClick={() => { localStorage.setItem('learnpath-active-module-index', moduleIndex - 1); setModuleIndex(moduleIndex - 1); }} className="btn-secondary py-2">
              Previous Module
            </button>
            <button onClick={handleComplete} className="btn-primary py-2 px-4">
              Mark Complete
            </button>
            <button disabled={moduleIndex === path.modules.length - 1} onClick={() => { localStorage.setItem('learnpath-active-module-index', moduleIndex + 1); setModuleIndex(moduleIndex + 1); }} className="btn-secondary py-2">
              Next Module
            </button>
          </div>
        </article>
        
        <aside className="premium-card h-fit p-5 lg:sticky lg:top-24 space-y-4">
          <h2 className="font-bold text-slate-950 dark:text-white">Knowledge Resources</h2>
          <div className="space-y-2">
            {resources.map((res) => (
              <a key={res.title} href={res.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/70 bg-white/55 p-3 text-sm font-semibold text-slate-600 hover:border-violet-300 dark:border-white/5 dark:bg-white/5 dark:text-slate-300">
                {res.title}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}

function QuizPage() {
  const [path, setPath] = useState(null);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setPath(getSavedPath());
    const idx = parseInt(localStorage.getItem('learnpath-active-module-index') || '0');
    setModuleIndex(idx);
  }, []);

  if (!path) return null;
  const module = path.modules[moduleIndex];
  const quiz = module.quiz || [
    {
      question: "What creates a strong AI learning loop?",
      options: ["A landing page", "A learner state, a generated plan, practice, and adaptation.", "Static videos", "Static curriculum"],
      answer: "A learner state, a generated plan, practice, and adaptation.",
      explanation: "Loop relies on state analysis."
    }
  ];

  const currentQuestion = quiz[qIndex];

  function handleSelect(option) {
    if (showExplanation) return;
    setSelected(option);
    setShowExplanation(true);
    if (option === currentQuestion.answer) {
      setCorrectCount(prev => prev + 1);
    }
  }

  function handleNext() {
    setSelected('');
    setShowExplanation(false);
    if (qIndex < quiz.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const finalScore = Math.round((correctCount / quiz.length) * 100);
      setScore(finalScore);
      if (finalScore >= 80) confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } });
    }
  }

  return (
    <PageTransition>
      <PageHeader kicker={`Quiz · Module ${moduleIndex + 1}`} title="Check your understanding." />
      <div className="premium-card mx-auto max-w-3xl p-6 space-y-6">
        {score === null ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400">Question {qIndex + 1} of {quiz.length}</span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div style={{ width: `${((qIndex + 1) / quiz.length) * 100}%` }} className="h-full bg-brand-primary" />
              </div>
            </div>
            
            <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">{currentQuestion.question}</h2>
            
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selected === option;
                const isCorrect = option === currentQuestion.answer;
                const buttonStyle = showExplanation
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : isSelected
                      ? 'border-rose-300 bg-rose-50/50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400'
                      : 'border-white/70 bg-white/70 text-slate-400 dark:border-white/10 dark:bg-slate-950/70'
                  : isSelected
                    ? 'border-violet-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-brand-primary dark:bg-indigo-500/10'
                    : 'border-white/70 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200';
                
                return (
                  <motion.button key={option} disabled={showExplanation} whileHover={{ scale: 1.01 }} onClick={() => handleSelect(option)} className={cn('w-full rounded-2xl border p-4 text-left font-semibold shadow-sm backdrop-blur-xl transition', buttonStyle)}>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-white/5 dark:border-white/5 text-sm space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">Explanation</p>
                <p className="text-slate-600 dark:text-slate-300">{currentQuestion.explanation}</p>
                <button onClick={handleNext} className="btn-primary py-2 mt-2">
                  {qIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-4">
            <Trophy size={48} className="mx-auto text-amber-500" />
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Quiz Completed!</h2>
            <p className="text-xl text-slate-500">Your Score: <span className="font-black text-brand-success">{score}%</span></p>
            <button onClick={() => navigate('/course')} className="btn-primary py-2.5 mt-4">Back to Roadmap</button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

function ProjectsPage() {
  const [path, setPath] = useState(null);
  const [moduleIndex, setModuleIndex] = useState(0);

  useEffect(() => {
    setPath(getSavedPath());
    const idx = parseInt(localStorage.getItem('learnpath-active-module-index') || '0');
    setModuleIndex(idx);
  }, []);

  if (!path) return null;
  const module = path.modules[moduleIndex];
  const activeProjects = module.projects || [
    { title: 'Calculator', type: 'Mini', difficulty: 'Beginner', description: 'Create basic calculator functions.', objectives: ['Math operators'], technologies: ['Python'], expected_output: 'Heartbeat response', outcomes: 'Logic checks', checklist: ['Code check'] }
  ];

  return (
    <PageTransition>
      <PageHeader kicker={`Projects · Module ${moduleIndex + 1}`} title="Turn concepts into portfolio proof." />
      <div className="grid gap-5 lg:grid-cols-3">
        {activeProjects.map((project) => (
          <motion.article key={project.title} whileHover={{ y: -6, scale: 1.01 }} className="premium-card p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-brand-primary dark:bg-indigo-500/10">{project.type}</span>
                <span className="text-xs font-semibold text-slate-400">{project.difficulty}</span>
              </div>
              <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">{project.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{project.description}</p>
              
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Objectives</p>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {project.objectives.map(obj => <li key={obj}>{obj}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Technologies Used</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map(tech => (
                    <span key={tech} className="bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 text-xs px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-white/10 mt-6">
              <button onClick={() => alert("Checklist:\n" + project.checklist.join("\n"))} className="btn-secondary w-full py-2">
                Start Project / View Checklist
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </PageTransition>
  );
}

function InterviewPage() {
  const [open, setOpen] = useState(0);
  const [path, setPath] = useState(null);
  const [activeTab, setActiveTab] = useState('Technical');

  useEffect(() => {
    setPath(getSavedPath());
  }, []);

  if (!path) return null;
  const activeQuestions = path.interview || [
    { question: 'Explain your learning project architecture.', type: 'Technical', difficulty: 'Intermediate', expected_answer: 'Modular components linked to standard REST schemas.', hint: 'Use context panels' }
  ];

  const filteredQuestions = activeQuestions.filter(q => q.type === activeTab);

  return (
    <PageTransition>
      <PageHeader kicker="Interview Preparation" title="Practice technical, HR, scenario-based, and system design questions." />
      
      <div className="flex flex-wrap gap-2 mb-6">
        {['Technical', 'Coding', 'HR', 'Scenario', 'System Design'].map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setOpen(0); }} className={cn('px-4 py-2 rounded-2xl font-bold text-sm transition', activeTab === tab ? 'bg-indigo-600 text-white shadow-glow' : 'bg-white/50 text-slate-600 dark:bg-white/5 dark:text-slate-300')}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {filteredQuestions.map((q, index) => (
          <motion.article key={q.question} whileHover={{ y: -6, scale: 1.01 }} className="premium-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-brand-primary dark:bg-indigo-500/10">{q.type}</span>
                <span className="text-xs font-bold text-slate-400">{q.difficulty}</span>
              </div>
              <h2 className="text-[22px] font-bold text-slate-950 dark:text-white leading-snug">{q.question}</h2>
              <p className="text-xs text-slate-400 mt-2">Hint: {q.hint}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
              <button onClick={() => setOpen(open === index ? -1 : index)} className="btn-secondary ripple w-full py-2">
                {open === index ? 'Hide Answer' : 'Reveal Expected Answer'}
              </button>
              <AnimatePresence>
                {open === index && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-sm text-slate-600 dark:text-slate-300">
                    {q.expected_answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.article>
        ))}
        {filteredQuestions.length === 0 && (
          <div className="lg:col-span-3 text-center py-12">
            <p className="text-slate-500">No questions available in this category for the current path.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function AnalyticsPage() {
  const [path, setPath] = useState(null);

  useEffect(() => {
    setPath(getSavedPath());
  }, []);

  if (!path) {
    return (
      <PageTransition>
        <PageHeader kicker="Learning Analytics" title="Analytics unlock after your first learning actions." />
        <div className="premium-card p-8 text-center max-w-xl mx-auto space-y-4">
          <Layers3 className="mx-auto text-brand-primary" size={32} />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">No Data Yet</h2>
          <p className="text-slate-500 text-sm">Complete your first lesson to unlock interactive metrics and skill graph visualizations.</p>
        </div>
      </PageTransition>
    );
  }

  // Calculate metrics
  const progress = Math.round(path.modules.reduce((acc, m) => acc + (m.progress || 0), 0) / path.modules.length);

  return (
    <PageTransition>
      <PageHeader kicker="Analytics Dashboard" title="Track your learning performance." />
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Progress Chart card */}
        <div className="premium-card p-6 lg:col-span-2 space-y-6">
          <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Roadmap Completion & Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold">
                <span>Overall Path Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-white/5 dark:border-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase">Strong Topics</p>
                <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">{path.topic} Foundations</p>
              </div>
              <div className="p-4 rounded-2xl bg-fuchsia-50/50 border border-fuchsia-100 dark:bg-white/5 dark:border-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase">Focus Recommendation</p>
                <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">Review capstone tasks and project checklists</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic skills ring card */}
        <div className="premium-card p-6 flex flex-col items-center justify-center text-center">
          <ProgressRing value={progress} />
          <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">Skills Verified</p>
          <p className="text-xs text-slate-400">Calculated from complete learning modules.</p>
        </div>
      </div>
    </PageTransition>
  );
}

function Metric({ label, value, icon: Icon, tone, delay = 0 }) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className="premium-card p-5 flex items-center justify-between overflow-hidden"
    >
      <div className="space-y-1">
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      </div>
      <span className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow', tone)}>
        <Icon size={20} />
      </span>
    </motion.div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('learnpath-token');
    if (!token) {
      navigate('/login');
      return;
    }
    getProfile()
      .then(data => {
        setProfile(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setUpdating(true);
    try {
      await saveProfile(profile);
      alert("Settings saved successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || err.message || "Failed to save settings");
    } finally {
      setUpdating(false);
    }
  }

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  if (loading) return <div className="grid h-64 place-items-center"><CircleDashed size={32} className="animate-spin text-brand-primary" /></div>;

  return (
    <PageTransition>
      <PageHeader kicker="User Settings" title="Manage your AI learning preferences." />
      <form onSubmit={handleSave} className="premium-card p-6 sm:p-8 max-w-3xl space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Full Name</span>
            <input name="full_name" required value={profile.full_name || ''} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
          </label>
          <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Target Career Role</span>
            <input name="target_role" required value={profile.target_role || ''} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white" />
          </label>
          <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Daily Study Hours</span>
            <select name="daily_study_hours" value={profile.daily_study_hours || '2'} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
              <option value="1">1 Hour / day</option>
              <option value="2">2 Hours / day</option>
              <option value="3">3 Hours / day</option>
              <option value="4">4+ Hours / day</option>
            </select>
          </label>
          <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 dark:border-white/10 dark:bg-slate-950/70">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Learning Style</span>
            <select name="learning_style" value={profile.learning_style || 'Project-based'} onChange={handleChange} className="mt-2 w-full bg-transparent font-semibold outline-none dark:text-white">
              <option value="Project-based">Project-based (sprints & builders)</option>
              <option value="Theory-based">Theory-heavy (comprehensive details)</option>
              <option value="Hybrid">Hybrid (mixed concepts & practice)</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={updating} className="btn-primary py-2.5 px-6">
          {updating ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </PageTransition>
  );
}

function AppShell({ children, dark, setDark }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const customNavItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Generate Path', path: '/generate', icon: Wand2 },
    { label: 'Roadmap', path: '/course', icon: BookOpen },
    { label: 'Interview Prep', path: '/interview', icon: BrainCircuit },
    { label: 'Analytics', path: '/analytics', icon: LineChart },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  function handleLogout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/50 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="p-6">
            <BrandLogo />
          </div>
          <nav className="space-y-1 px-4">
            {customNavItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    active
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-brand-primary dark:text-violet-400'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-2">
          <ThemeToggle dark={dark} setDark={setDark} />
          <button onClick={handleLogout} className="btn-secondary w-full py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-64 bg-white p-6 shadow-xl dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <BrandLogo />
                  <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <nav className="space-y-1">
                  {customNavItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                          active ? 'bg-indigo-50 text-indigo-600 dark:bg-white/5 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                <ThemeToggle dark={dark} setDark={setDark} />
                <button onClick={handleLogout} className="btn-secondary w-full py-2.5 text-rose-500">
                  Logout
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-6 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/70">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsOpen(true)}><Menu size={22} /></button>
            <LogoMark className="h-8 w-8 lg:hidden" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">LearnPath Studio</span>
          </div>
        </header>

        {/* Dynamic Page content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function PageHeader({ kicker, title }) {
  return (
    <div className="mb-7">
      <p className="font-semibold text-brand-primary">{kicker}</p>
      <h1 className="mt-2 max-w-4xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">{title}</h1>
    </div>
  );
}

function CenteredShell({ children }) {
  return <div className="mesh-bg min-h-screen">{children}</div>;
}

function FloatingAssistant() {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-glow"
      aria-label="Open AI assistant"
    >
      <Sparkles size={22} />
    </motion.button>
  );
}

function Footer({ minimal = false }) {
  return (
    <footer className={cn('border-t border-white/70 bg-white/50 py-8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/50', minimal && 'absolute bottom-0 left-0 right-0 border-transparent bg-transparent py-5')}>
      <div className="section flex flex-col justify-between gap-3 text-center text-sm text-slate-500 md:flex-row md:text-left">
        <span>LearnPath AI</span>
        <span>Built by AI Mavericks team</span>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <CenteredShell>
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <LogoMark className="mx-auto mb-5 h-16 w-16" />
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">404</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">This learning path does not exist yet.</p>
          <Link to="/" className="btn-primary mt-6">Go Home</Link>
        </div>
      </div>
    </CenteredShell>
  );
}

function RoutedApp() {
  const [dark, setDark] = useDarkMode();
  const location = useLocation();
  const inShell = ['/dashboard', '/generate', '/learning', '/course', '/lesson', '/quiz', '/projects', '/interview', '/analytics', '/settings'].includes(location.pathname);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const routeContent = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing dark={dark} setDark={setDark} />} />
        <Route path="/login" element={<AuthLayout mode="login" />} />
        <Route path="/signup" element={<AuthLayout mode="signup" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/generate" element={<GenerateCoursePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/learning" element={<HomeDashboard />} />
        <Route path="/loading-module" element={<LoadingModulePage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/lesson" element={<LessonPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );

  return (
    <>
      {inShell ? <AppShell dark={dark} setDark={setDark}>{routeContent}</AppShell> : routeContent}
      {location.pathname !== '/' && <FloatingAssistant />}
    </>
  );
}

export default function App() {
  return <RoutedApp />;
}
