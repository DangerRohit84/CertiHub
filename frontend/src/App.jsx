import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase/firebase';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import ChatBot from './components/ChatBot';
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const CertificateDetails = lazy(() => import('./pages/CertificateDetails'));
const Verify = lazy(() => import('./pages/Verify'));
const Settings = lazy(() => import('./pages/Settings'));
const CareerAdvisor = lazy(() => import('./pages/CareerAdvisor'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InstitutionDashboard = lazy(() => import('./pages/InstitutionDashboard'));
const HODDashboard = lazy(() => import('./pages/HODDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const OrganizationDashboard = lazy(() => import('./pages/OrganizationDashboard'));

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || 'student');
        } else {
          setRole('student');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (user.email === 'admin@certihub.com') return children;
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" />;
};

const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
    <h1 className="text-2xl font-bold">{title} Dashboard Coming Soon</h1>
    <p className="mt-2 text-sm">We are finalizing this workspace for your role.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[rgb(var(--app-bg))] text-slate-950 transition-colors duration-200 dark:text-slate-100">
        <Navbar />
        <ThemeToggle />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <ChatBot />
        <main className="pt-16">
          <Suspense fallback={
            <div className="flex h-[80vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['student']}><Dashboard /></RoleProtectedRoute>} />
              <Route path="/institution" element={<RoleProtectedRoute allowedRoles={['institution']}><InstitutionDashboard /></RoleProtectedRoute>} />
              <Route path="/hod" element={<RoleProtectedRoute allowedRoles={['hod']}><HODDashboard /></RoleProtectedRoute>} />
              <Route path="/mentor" element={<RoleProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></RoleProtectedRoute>} />
              <Route path="/organization" element={<RoleProtectedRoute allowedRoles={['org_admin']}><OrganizationDashboard /></RoleProtectedRoute>} />
              <Route path="/employee" element={<RoleProtectedRoute allowedRoles={['employee']}><Placeholder title="Employee" /></RoleProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/user/:username" element={<Portfolio />} />
              <Route path="/certificate/:id" element={<CertificateDetails />} />
              <Route path="/verify/:id" element={<Verify />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/advisor" element={<CareerAdvisor />} />
              <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
