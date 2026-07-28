import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { ShieldCheck, User, Settings, LogOut, ChevronDown, Compass, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (docSnap.exists()) setDbUser(docSnap.data());
        } catch (e) {
          console.error('Error fetching user', e);
        }
      } else {
        setDbUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const getDisplayName = () => {
    if (dbUser?.username) return dbUser.username;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getRoleLink = () => {
    if (user?.email === 'admin@certihub.com' || dbUser?.role === 'admin') return { to: '/admin', label: 'Admin', icon: <ShieldCheck className="h-4 w-4" /> };
    if (dbUser?.role === 'institution') return { to: '/institution', label: 'Institution', icon: <LayoutDashboard className="h-4 w-4" /> };
    if (dbUser?.role === 'hod') return { to: '/hod', label: 'HOD Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> };
    if (dbUser?.role === 'mentor') return { to: '/mentor', label: 'Review Board', icon: <LayoutDashboard className="h-4 w-4" /> };
    if (dbUser?.role === 'org_admin') return { to: '/organization', label: 'Organization', icon: <LayoutDashboard className="h-4 w-4" /> };
    return { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> };
  };

  const roleLink = getRoleLink();

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      isScrolled 
        ? 'py-2' 
        : 'py-3'
    }`}>
      <div className={`mx-auto max-w-7xl px-5 sm:px-6 lg:px-12 transition-all duration-500 ${
        isScrolled 
          ? 'mx-4 sm:mx-6 lg:mx-auto rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200/40 dark:border-white/[0.06] shadow-medium' 
          : ''
      }`}>
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-soft dark:bg-slate-900 transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="CertiHub" className="h-full w-full object-contain" />
            </span>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Certi<span className="text-brand-600 dark:text-brand-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to={roleLink.to} className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-brand-400">
                  {roleLink.icon}
                  {roleLink.label}
                </Link>
                {(!dbUser?.role || dbUser?.role === 'student') && (
                  <Link to="/advisor" className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-brand-400">
                    <Compass className="h-4 w-4" />
                    Advisor
                  </Link>
                )}

                <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2" />

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-md shadow-brand-500/20">
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 dark:text-slate-200 lg:block">{getDisplayName()}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 p-2 backdrop-blur-2xl shadow-heavy dark:border-white/[0.08] dark:bg-slate-900/95"
                      >
                        <div className="mb-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/[0.04]">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{getDisplayName()}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>

                        <NavMenuLink to={roleLink.to} onClick={() => setIsDropdownOpen(false)} icon={roleLink.icon} label={roleLink.label} />
                        {(!dbUser?.role || dbUser?.role === 'student') && (
                          <NavMenuLink to="/advisor" onClick={() => setIsDropdownOpen(false)} icon={<Compass className="h-4 w-4" />} label="Career Advisor" />
                        )}
                        <NavMenuLink to={`/user/${dbUser?.username || user.uid}`} onClick={() => setIsDropdownOpen(false)} icon={<User className="h-4 w-4" />} label="Public Profile" />
                        <NavMenuLink to="/settings" onClick={() => setIsDropdownOpen(false)} icon={<Settings className="h-4 w-4" />} label="Settings" />

                        <div className="my-2 border-t border-slate-100 dark:border-white/[0.06]" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary px-5 py-2.5 text-sm">
                  Sign in
                </Link>
                <Link to="/login" className="btn-primary px-5 py-2.5 text-sm">
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.06]"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200/40 dark:border-white/[0.06]"
            >
              <div className="py-4 space-y-1">
                {user ? (
                  <>
                    <Link to={roleLink.to} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                      {roleLink.icon} {roleLink.label}
                    </Link>
                    {(!dbUser?.role || dbUser?.role === 'student') && (
                      <Link to="/advisor" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                        <Compass className="h-4 w-4" /> Career Advisor
                      </Link>
                    )}
                    <Link to={`/user/${dbUser?.username || user.uid}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                      <User className="h-4 w-4" /> Public Profile
                    </Link>
                    <div className="border-t border-slate-100 dark:border-white/[0.06] my-2" />
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full py-3 text-sm">Sign in</Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full py-3 text-sm">Get started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const NavMenuLink = ({ to, onClick, icon, label, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/[0.04] dark:hover:text-brand-400 ${className}`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
