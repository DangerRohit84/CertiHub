import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="fixed right-6 top-1/2 z-[100] -translate-y-1/2">
      <div className="flex flex-col items-center gap-4">
        <div className="group relative flex h-20 w-10 flex-col items-center justify-between rounded-full bg-slate-200/50 p-1 backdrop-blur-xl transition-all hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
          <button
            onClick={toggleTheme}
            className="relative h-full w-full"
            aria-label="Toggle Theme"
          >
            {/* The Track Line (Subtle) */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-600 opacity-30" />

            {/* Sliding Circular Knob */}
            <motion.div
              className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-brand-500"
              animate={{
                y: theme === 'dark' ? 0 : 40, // Top for Dark, Bottom for Light
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                  >
                    <Moon className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
