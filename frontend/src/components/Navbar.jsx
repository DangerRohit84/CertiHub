import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { ShieldCheck, User, Settings, LogOut, ChevronDown, Compass, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-900/10 bg-white/78 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-950/72">
      <div className="app-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-brand-700 dark:text-brand-500">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-lg shadow-indigo-900/10 dark:bg-slate-900">
            <img src={logo} alt="CertiHub Logo" className="h-full w-full object-contain" />
          </span>
          <span>CertiHub</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {user.email === 'admin@certihub.com' && (
                <Link to="/admin" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              {/* Role-based Dashboard Link */}
              {dbUser?.role === 'institution' && (
                <Link to="/institution" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                  <LayoutDashboard className="h-4 w-4" />
                  Institution
                </Link>
              )}
              {dbUser?.role === 'hod' && (
                <Link to="/hod" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                  <LayoutDashboard className="h-4 w-4" />
                  HOD Dashboard
                </Link>
              )}
              {dbUser?.role === 'mentor' && (
                <Link to="/mentor" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                  <LayoutDashboard className="h-4 w-4" />
                  Review Board
                </Link>
              )}
              {(!dbUser?.role || dbUser?.role === 'student') && (
                <>
                  <Link to="/dashboard" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/advisor" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
                    <Compass className="h-4 w-4" />
                    Advisor
                  </Link>
                </>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-slate-900/10 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/5 sm:px-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-sm font-black text-brand-800 dark:bg-brand-500/15 dark:text-brand-300">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-28 truncate text-sm font-bold text-slate-700 dark:text-slate-200 sm:block">{getDisplayName()}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-900/10 bg-white p-2 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900">
                    <div className="mb-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                      <p className="truncate text-sm font-black text-slate-950 dark:text-white">{getDisplayName()}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>

                    {dbUser?.role === 'institution' && <NavMenuLink to="/institution" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard className="h-4 w-4" />} label="Institution Hub" />}
                    {dbUser?.role === 'hod' && <NavMenuLink to="/hod" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard className="h-4 w-4" />} label="HOD Dashboard" />}
                    {dbUser?.role === 'mentor' && <NavMenuLink to="/mentor" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard className="h-4 w-4" />} label="Review Board" />}
                    
                    {(!dbUser?.role || dbUser?.role === 'student') && (
                      <>
                        <NavMenuLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
                        <NavMenuLink to="/advisor" onClick={() => setIsDropdownOpen(false)} icon={<Compass className="h-4 w-4" />} label="Career Advisor" />
                      </>
                    )}

                    <NavMenuLink to={`/user/${dbUser?.username || user.uid}`} onClick={() => setIsDropdownOpen(false)} icon={<User className="h-4 w-4" />} label="Public Profile" />
                    <NavMenuLink to="/settings" onClick={() => setIsDropdownOpen(false)} icon={<Settings className="h-4 w-4" />} label="Settings" />
                    
                    {(user.email === 'admin@certihub.com' || dbUser?.role === 'admin') && (
                      <NavMenuLink to="/admin" onClick={() => setIsDropdownOpen(false)} icon={<ShieldCheck className="h-4 w-4" />} label="Admin Dashboard" />
                    )}

                    <div className="my-2 border-t border-slate-100 dark:border-white/10"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login" className="btn-primary px-4 py-2 sm:px-5">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavMenuLink = ({ to, onClick, icon, label, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-brand-400 ${className}`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
