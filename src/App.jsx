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
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';

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

  function submit(event) {
    event.preventDefault();
    localStorage.setItem('learnpath-auth', 'true');
    navigate('/profile');
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
                {!isLogin && <AuthField label="Full Name" icon={UserRound} placeholder="Sindhu Rao" />}
                <AuthField label="Email" icon={Mail} type="email" placeholder="you@example.com" />
                <AuthField label="Password" icon={LockKeyhole} type="password" placeholder="••••••••" />
                {!isLogin && <AuthField label="Confirm Password" icon={ShieldCheck} type="password" placeholder="••••••••" />}
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

function AuthField({ label, icon: Icon, type = 'text', placeholder }) {
  return (
    <label className="group block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 focus-within:shadow-glow dark:border-white/10 dark:bg-slate-950/70">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        <Icon size={15} /> {label}
      </span>
      <input type={type} placeholder={placeholder} className="mt-2 w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-300 dark:text-white" />
    </label>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const fields = [
    ['Name', 'Your display name'],
    ['Learning Goal', 'Become a frontend AI engineer'],
    ['Current Skill Level', 'Beginner, intermediate, advanced'],
    ['Daily Study Time', '45 minutes'],
    ['Preferred Learning Style', 'Visual, project-based, reading, mixed'],
    ['Target Completion Date', 'YYYY-MM-DD'],
  ];

  function finishSetup(event) {
    event.preventDefault();
    localStorage.setItem('learnpath-profile', 'true');
    navigate('/dashboard');
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
            <p className="font-semibold text-brand-primary">First-Time Profile Creation</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
              Personalize LearnPath AI before your dashboard unlocks.
            </h1>
            <form onSubmit={finishSetup} className="mt-8 premium-card p-5 sm:p-8">
              <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 via-cyan-400 to-amber-300" />
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
                {fields.map(([label, placeholder]) => (
                  <motion.label variants={rise} key={label} className="group rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition focus-within:border-violet-300 focus-within:shadow-glow dark:border-white/10 dark:bg-slate-950/70">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      <Sparkles size={15} />
                      {label}
                    </span>
                    <input type={label.includes('Date') ? 'date' : 'text'} placeholder={placeholder} className="mt-2 w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-300 dark:text-white" />
                  </motion.label>
                ))}
              </motion.div>
              <div className="mt-8 flex justify-end">
                <button className="btn-primary ripple">Continue <ArrowRight size={18} /></button>
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
  const agents = ['Profile Agent', 'Curriculum Agent', 'Content Agent', 'Knowledge Agent', 'Assessment Agent', 'Projects Agent', 'Interview Agent', 'Learning Analytics'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (active < agents.length - 1) {
      const timer = setTimeout(() => setActive((value) => value + 1), 650);
      return () => clearTimeout(timer);
    }
    const done = setTimeout(() => navigate('/learning'), 900);
    return () => clearTimeout(done);
  }, [active, agents.length, navigate]);

  return (
    <CenteredShell>
      <div className="grid min-h-screen place-items-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <div className="mb-5 flex justify-center"><BrandLogo /></div>
            <p className="font-semibold text-brand-primary">Course Generation Pipeline</p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-950 dark:text-white">Your first learning path is being built.</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Thinking, sequencing, evaluating <TypingDots /></p>
          </motion.div>
          <div className="premium-card p-5 sm:p-8">
            <div className="space-y-4">
              {agents.map((agent, index) => {
                const complete = index < active;
                const current = index === active;
                return (
                  <motion.div
                    key={agent}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={cn('flex items-center justify-between rounded-2xl border p-4 shadow-sm backdrop-blur-xl', current ? 'border-violet-200 bg-gradient-to-r from-indigo-50 to-fuchsia-50 dark:border-indigo-400/20 dark:from-indigo-500/10 dark:to-fuchsia-500/10' : 'border-white/70 bg-white/65 dark:border-white/10 dark:bg-slate-950/60')}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn('grid h-10 w-10 place-items-center rounded-xl', complete ? 'bg-brand-success text-white' : current ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/10')}>
                        {complete ? <Check size={18} /> : current ? <CircleDashed className="animate-spin" size={18} /> : <Clock3 size={18} />}
                      </span>
                      <span className="font-bold text-slate-950 dark:text-white">{agent}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{complete ? '✓' : current ? 'Loading...' : 'Waiting...'}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CenteredShell>
  );
}

function AppShell({ children, dark, setDark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mesh-bg min-h-screen">
      <aside className={cn('fixed inset-y-0 left-0 z-40 w-72 border-r border-white/70 bg-white/58 p-4 shadow-soft backdrop-blur-2xl transition duration-300 lg:translate-x-0 dark:border-white/10 dark:bg-slate-950/66', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="mb-8 flex items-center justify-between">
          <BrandLogo />
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar"><X size={20} /></button>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn('group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition duration-300', isActive ? 'bg-white/80 text-brand-primary shadow-sm dark:bg-white/10' : 'text-slate-600 hover:-translate-y-0.5 hover:bg-white/55 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-white/5')}
            >
              <Icon className="transition group-hover:scale-110" size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/70 bg-white/50 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/48 sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar"><Menu size={22} /></button>
          <div className="hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/66 px-3 py-2 text-sm text-slate-500 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 md:flex">
            <Search size={16} /> Search lessons, projects, notes
            <kbd className="ml-8 rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/10">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <motion.button whileHover={{ y: -2 }} className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
            </motion.button>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 text-sm font-semibold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
              <UserRound size={17} /> Sindhu
            </button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function HomeDashboard() {
  return (
    <PageTransition>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <PremiumCard className="p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-brand-primary">Home Dashboard</p>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homeStats.map((stat, index) => <Metric key={stat.label} {...stat} delay={index * 0.04} />)}
        </div>
      </motion.div>
    </PageTransition>
  );
}

function GenerateCoursePage() {
  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <PremiumCard className="p-6 sm:p-8">
          <p className="font-semibold text-brand-primary">Generate Course</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">Create your personalized learning path.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">The agent team will use your authenticated profile to build a course, projects, quizzes, analytics setup, and interview plan.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {['Topic', 'Primary Outcome', 'Weekly Schedule', 'Depth'].map((field) => (
              <label key={field} className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{field}</span>
                <input placeholder={field === 'Topic' ? 'AI frontend engineering' : ' '} className="mt-2 w-full bg-transparent font-semibold outline-none placeholder:text-slate-300 dark:text-white" />
              </label>
            ))}
          </div>
          <PrimaryButton to="/loading" className="mt-7">Generate Course <ArrowRight size={18} /></PrimaryButton>
        </PremiumCard>
        <PremiumCard className="p-6">
          <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Agent Plan</h2>
          <div className="mt-5 space-y-4">
            {['Curriculum map', 'Lesson sequence', 'Projects', 'Quizzes', 'Interview prep'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
                <CircleDashed size={18} className="text-brand-primary" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </PageTransition>
  );
}

function LearningDashboard() {
  return (
    <PageTransition>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <PremiumCard className="p-6 sm:p-8">
          <p className="font-semibold text-brand-primary">Learning Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">AI Frontend Engineering Path</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Your first course is generated. Continue into the roadmap, lessons, projects, and interview preparation.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/course" className="btn-primary ripple">Open Course <Play size={17} /></Link>
            <Link to="/projects" className="btn-secondary ripple">View Projects</Link>
          </div>
        </PremiumCard>
        <PremiumCard className="p-6">
          <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Today&apos;s Focus</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Start with module 1 and complete the first knowledge check. Analytics begin after your first lesson.</p>
          <ProgressRing value={4} />
        </PremiumCard>
      </div>
      <QuickActions />
    </PageTransition>
  );
}

function Metric({ icon: Icon, label, value, tone = 'from-indigo-500 to-violet-500', delay = 0 }) {
  return (
    <motion.div variants={rise} transition={{ delay }} className="premium-card p-5">
      <div className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow', tone)}>
        <Icon size={21} />
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn('mt-1 font-extrabold text-slate-950 dark:text-white', value.length > 7 ? 'text-2xl' : 'text-4xl')}>{value}</p>
    </motion.div>
  );
}

function QuickActions() {
  return (
    <section className="mt-5 grid gap-4 md:grid-cols-4">
      {[
        ['New quiz', Zap],
        ['Open roadmap', BookOpen],
        ['Mock interview', Command],
        ['Analyze gaps', LineChart],
      ].map(([label, Icon]) => (
        <motion.button key={label} variants={rise} whileHover={{ y: -5, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="premium-card ripple flex items-center gap-3 p-5 text-left font-bold text-slate-900 dark:text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-cyan"><Icon size={18} /></span>
          {label}
        </motion.button>
      ))}
    </section>
  );
}

function CoursePage() {
  const [expanded, setExpanded] = useState(0);
  return (
    <PageTransition>
      <PageHeader kicker="Course Roadmap" title="AI Frontend Engineering roadmap." />
      <div className="space-y-5">
        {modules.map((module, index) => (
          <motion.article key={module.title} layout whileHover={{ y: -4 }} className="premium-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white shadow-glow">{index + 1}</span>
                <div>
                  <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">{module.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{module.difficulty} · {module.duration} · {module.progress}% complete</p>
                </div>
              </div>
              <ChevronDown className={cn('transition', expanded === index && 'rotate-180')} size={20} />
            </button>
            <AnimatePresence>
              {expanded === index && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200 dark:border-white/10">
                  <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${module.progress}%` }} className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to="/lesson" className="btn-primary py-2">Lesson</Link>
                      <Link to="/quiz" className="btn-secondary py-2">Quiz</Link>
                      <Link to="/projects" className="btn-secondary py-2">Project</Link>
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
  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <article className="premium-card p-6 sm:p-9">
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: '10%' }} className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-400" /></div>
          <p className="font-semibold text-brand-primary">Lesson 1.1</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-950 dark:text-white">How AI-assisted interfaces are structured.</h1>
          <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">Start with the product goal, identify the user state, then design agent actions around a clear learning loop.</p>
          <div className="my-8 rounded-2xl border border-sky-200/70 bg-sky-50/75 p-5 shadow-cyan backdrop-blur-xl dark:border-sky-400/20 dark:bg-sky-500/10">
            <h2 className="font-bold text-slate-950 dark:text-white">Tip</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Great AI learning tools reveal the next best action, not every possible action.</p>
          </div>
          <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100"><code>{`const learningLoop = {
  profile: "understand the learner",
  plan: "generate a path",
  practice: "produce evidence",
  adapt: "update recommendations"
};`}</code></pre>
        </article>
        <aside className="premium-card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-slate-950 dark:text-white">In this lesson</h2>
          {['Concept', 'Example', 'Code', 'Checkpoint'].map((item) => (
            <a key={item} href="#" className="mt-3 block rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">{item}</a>
          ))}
        </aside>
      </div>
    </PageTransition>
  );
}

function QuizPage() {
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(null);
  const answer = 'A learner state, a generated plan, practice, and adaptation.';

  function submit() {
    const nextScore = selected === answer ? 96 : 62;
    setScore(nextScore);
    if (nextScore > 90) confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
  }

  return (
    <PageTransition>
      <PageHeader kicker="Quiz" title="Check your understanding." />
      <div className="premium-card mx-auto max-w-3xl p-6">
        <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">What creates a strong AI learning loop?</h2>
        <div className="mt-6 space-y-3">
          {['A landing page and a chatbot.', answer, 'Only videos and transcripts.', 'A static curriculum with no profile.'].map((option) => (
            <motion.button key={option} whileHover={{ scale: 1.01 }} onClick={() => setSelected(option)} className={cn('w-full rounded-2xl border p-4 text-left font-semibold shadow-sm backdrop-blur-xl transition', selected === option ? 'border-violet-300 bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-brand-primary dark:bg-indigo-500/10' : 'border-white/70 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200')}>
              {option}
            </motion.button>
          ))}
        </div>
        <button onClick={submit} className="btn-primary ripple mt-6">Submit Answer</button>
        {score && <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 text-3xl font-extrabold text-brand-success">Score: {score}%</motion.p>}
      </div>
    </PageTransition>
  );
}

function ProjectsPage() {
  const projects = [
    ['Build a study recommender', 'Intermediate', '4h', ['Embeddings', 'Ranking', 'UX']],
    ['Train a tiny classifier', 'Beginner', '2h', ['Python', 'Metrics', 'Validation']],
    ['Deploy an interview coach', 'Advanced', '8h', ['Agents', 'Prompts', 'Evaluation']],
  ];
  return (
    <PageTransition>
      <PageHeader kicker="Projects" title="Turn concepts into portfolio proof." />
      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map(([title, difficulty, time, skills]) => (
          <motion.article key={title} whileHover={{ y: -6, scale: 1.01 }} className="premium-card p-6">
            <p className="text-sm font-bold text-brand-primary">{difficulty} · {time}</p>
            <h2 className="mt-3 text-[22px] font-bold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Requirements, expected output, rubric, and review checklist are generated for your current level.</p>
            <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{skill}</span>)}</div>
            <button className="btn-primary ripple mt-6 w-full">Start Project</button>
          </motion.article>
        ))}
      </div>
    </PageTransition>
  );
}

function InterviewPage() {
  const [open, setOpen] = useState(0);
  const questions = ['Explain your learning project architecture.', 'Tell me how you debug ambiguous requirements.', 'Design a course recommendation system.'];
  return (
    <PageTransition>
      <PageHeader kicker="Interview Preparation" title="Practice technical, HR, and system thinking questions." />
      <div className="grid gap-5 lg:grid-cols-3">
        {questions.map((question, index) => (
          <motion.article key={question} whileHover={{ y: -6, scale: 1.01 }} className="premium-card p-6">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-brand-primary dark:bg-indigo-500/10">{['Technical', 'HR', 'System'][index]}</span>
            <h2 className="mt-4 text-[22px] font-bold text-slate-950 dark:text-white">{question}</h2>
            <button onClick={() => setOpen(open === index ? -1 : index)} className="btn-secondary ripple mt-6">Reveal Answer</button>
            <AnimatePresence>
              {open === index && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 leading-7 text-slate-600 dark:text-slate-300">Use a concise structure: context, decision, tradeoff, measurable result.</motion.p>}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
    </PageTransition>
  );
}

function AnalyticsPage() {
  return (
    <PageTransition>
      <PageHeader kicker="Learning Analytics" title="Analytics unlock after your first learning actions." />
      <div className="grid gap-5 xl:grid-cols-3">
        <PremiumCard className="p-6 xl:col-span-2">
          <h2 className="mb-5 text-[22px] font-bold text-slate-950 dark:text-white">Course Completion and Quiz Performance</h2>
          <EmptyAnalyticsCard />
        </PremiumCard>
        <PremiumCard className="p-6">
          <h2 className="text-[22px] font-bold text-slate-950 dark:text-white">Topic Strength</h2>
          <div className="mt-6 grid h-64 place-items-center rounded-[1.4rem] border border-dashed border-indigo-200 bg-white/45 text-center dark:border-indigo-400/20 dark:bg-white/5">
            <div>
              <Layers3 className="mx-auto text-brand-primary" size={32} />
              <p className="mt-3 font-bold text-slate-950 dark:text-white">No Data Yet</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">Start your first course to unlock analytics.</p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </PageTransition>
  );
}

function SettingsPage() {
  return (
    <PageTransition>
      <PageHeader kicker="Settings" title="Tune your learning operating system." />
      <div className="premium-card max-w-3xl p-6">
        {['Daily reminders', 'Keyboard shortcuts', 'AI assistant follow-ups', 'Weekly progress email'].map((item) => (
          <label key={item} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0 dark:border-white/10">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{item}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-indigo-600" />
          </label>
        ))}
      </div>
    </PageTransition>
  );
}

function SectionHeader({ kicker, title }) {
  return (
    <div className="mb-8">
      <p className="font-semibold text-brand-primary">{kicker}</p>
      <h2 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">{title}</h2>
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
        <Route path="/learning" element={<LearningDashboard />} />
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
