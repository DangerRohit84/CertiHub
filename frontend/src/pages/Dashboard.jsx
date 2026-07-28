import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Search, ExternalLink, Trash2, Target, ChevronRight, Share2, Copy, Check, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import ForcedUsernameModal from '../components/modals/ForcedUsernameModal';

// Premium Workspace Dashboard
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fetching, setFetching] = useState(true);
  const [careerStatus, setCareerStatus] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  
  // Sharing State
  const [sharingId, setSharingId] = useState(null);
  const [generatedPost, setGeneratedPost] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [pendingConsents, setPendingConsents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const fileInputRef = useRef(null);

  async function fetchCareerStatus(certs) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/career-advice`, {
        certificates: certs
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCareerStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch career status", error);
    }
  }

  async function fetchCertificates(userId, email) {
    try {
      setFetching(true);
      // Fetch personal certificates
      const q = query(collection(db, "certificates"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const certs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      certs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setCertificates(certs);
      
      // Fetch pending institutional consents
      if (email) {
        const consentQ = query(collection(db, "certificates"), 
          where("studentEmail", "==", email),
          where("consentStatus", "==", "pending")
        );
        const consentSnapshot = await getDocs(consentQ);
        setPendingConsents(consentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }

      if (certs.length > 0) {
        fetchCareerStatus(certs);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setFetching(false);
    }
  }

  async function fetchUserData(uid) {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDbUser(data);
        return data;
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
        fetchCertificates(currentUser.uid, currentUser.email);
      } else {
        setFetching(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile) => {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload || !user) return;

    if (fileToUpload.size > 10 * 1024 * 1024) {
      toast.error("File is too large! Maximum size is 10MB.");
      return;
    }

    setLoading(true);
    const uploadToast = toast.loading("Analyzing certificate...");
    const formData = new FormData();
    formData.append('certificate', fileToUpload);

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = response.data;
      const newCert = {
        userId: user.uid,
        cloudinaryUrl: data.cloudinaryUrl,
        candidateName: data.aiData.candidateName || '',
        title: data.aiData.certificateTitle || 'Unknown Certificate',
        issuer: data.aiData.organization || 'Unknown Issuer',
        category: data.aiData.category || 'Other',
        skills: data.aiData.skills || [],
        aiSummary: data.aiData.aiSummary || '',
        resumeBullets: data.aiData.resumeBullets || [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "certificates"), newCert);
      setCertificates([{ id: docRef.id, ...newCert, createdAt: { toMillis: () => Date.now() } }, ...certificates]);
      toast.success("Certificate analyzed successfully!", { id: uploadToast });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to analyze certificate.", { id: uploadToast });
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleDelete = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    
    const certToDelete = certificates.find(c => c.id === certId);
    if (!certToDelete) return;

    try {
      // 1. Delete from Cloudinary via Backend
      if (certToDelete.cloudinaryUrl) {
        const token = await auth.currentUser?.getIdToken();
        await axios.post(`${import.meta.env.VITE_API_URL}/api/delete-file`, {
          url: certToDelete.cloudinaryUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "certificates", certId));
      
      // 3. Update local state
      setCertificates(prev => prev.filter(c => c.id !== certId));
      toast.success("Certificate deleted.");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete certificate resources.");
    }
  };

  const handleShareOnLinkedIn = async (cert) => {
    setSharingId(cert.id);
    const loadToast = toast.loading("Generating AI social post...");
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/generate-post`, {
        certificate: cert
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedPost(response.data.post);
      setShowShareModal(true);
      toast.success("Post generated!", { id: loadToast });
    } catch (error) {
      console.error("LinkedIn generation failed", error);
      toast.error("Failed to generate social post.", { id: loadToast });
      setSharingId(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConsent = async (certId, status) => {
    try {
      const docRef = doc(db, "certificates", certId);
      await updateDoc(docRef, {
        consentStatus: status,
        userId: user.uid, // Claim the certificate if accepted
        lastUpdated: serverTimestamp()
      });
      toast.success(`Certificate ${status === 'accepted' ? 'added to your vault' : 'rejected'}`);
      fetchCertificates(user.uid, user.email);
    } catch {
      toast.error("Handshake failed");
    }
  };

  const categories = ["All", ...new Set(certificates.map(c => c.category || "Other"))].sort();

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (c.issuer || "").toLowerCase().includes(searchTerm.toLowerCase());
    const itemCategory = c.category || 'Other';
    const matchesCategory = selectedCategory === 'All' || itemCategory.toLowerCase() === selectedCategory.toLowerCase();
    
    // Separate logic
    const isVerified = c.isInstitutional || c.verificationStatus === 'verified';
    if (activeTab === 'verified') return matchesSearch && matchesCategory && isVerified;
    if (activeTab === 'personal') return matchesSearch && matchesCategory && !isVerified;
    
    return matchesSearch && matchesCategory;
  });

  if (!user && !fetching) {
    return <div className="py-20 text-center font-semibold text-slate-500">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="app-shell py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="eyebrow mb-3">Your Certificates</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            Welcome, {dbUser?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Upload and manage your certificates here.</p>
        </div>
        {user && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="btn-primary"
            >
              <UploadCloud className="h-4 w-4" />
              {loading ? "Analyzing..." : "Upload Certificate"}
            </button>
            <Link to={`/user/${dbUser?.username || user.uid}`} className="btn-secondary">
              <ExternalLink className="w-4 h-4" /> View My Public Profile
            </Link>
          </div>
        )}
      </div>

      <hr className="mb-10 border-slate-900/10 dark:border-white/10" />

      {careerStatus && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mb-12 flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-slate-950 p-8 text-white shadow-2xl lg:flex-row">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Target className="w-48 h-48" /></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10"><Target className="w-8 h-8 text-brand-400" /></div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Your Job Goal</div>
              <div className="text-2xl font-black">{careerStatus.suggestedRole}</div>
            </div>
          </div>
          <div className="flex-1 max-w-lg w-full relative z-10">
            <div className="flex justify-between text-[10px] font-black mb-3"><span className="text-slate-400 uppercase tracking-[0.2em]">Job Score</span><span className="text-brand-400">{careerStatus.matchScore}%</span></div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${careerStatus.matchScore}%` }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-brand-600 to-brand-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            </div>
          </div>
          <Link to="/advisor" className="relative z-10 flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-black shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-500">
            Full Career Plan <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </motion.div>
      )}

      {/* Action Required: Institutional Records */}
      {pendingConsents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Action Required: Institutional Handshake</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {pendingConsents.map(cert => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 border-l-4 border-brand-500 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-50 rounded-2xl dark:bg-brand-900/20">
                    <CheckCircle2 className="w-8 h-8 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white">{cert.title}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleConsent(cert.id, 'rejected')}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 transition"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleConsent(cert.id, 'accepted')}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition"
                  >
                    Accept & Link
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-6">
          <div className="w-full sm:w-auto">
            <h2 className="section-title flex items-center gap-2 mb-6"><FileText className="w-6 h-6 text-brand-600" /> My Workspace</h2>
            <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl w-fit">
              <button onClick={() => setActiveTab('all')} className={`px-6 py-2 text-xs font-black rounded-lg transition ${activeTab === 'all' ? 'bg-white dark:bg-white/10 shadow-sm text-brand-600' : 'text-slate-400'}`}>All</button>
              <button onClick={() => setActiveTab('verified')} className={`px-6 py-2 text-xs font-black rounded-lg transition ${activeTab === 'verified' ? 'bg-white dark:bg-white/10 shadow-sm text-brand-600' : 'text-slate-400'}`}>Verified</button>
              <button onClick={() => setActiveTab('personal')} className={`px-6 py-2 text-xs font-black rounded-lg transition ${activeTab === 'personal' ? 'bg-white dark:bg-white/10 shadow-sm text-brand-600' : 'text-slate-400'}`}>Personal</button>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="field py-3 pl-10 pr-4 rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${selectedCategory === cat ? 'scale-105 border-brand-600 bg-brand-600 text-white shadow-md' : 'border-slate-900/10 bg-white/75 text-slate-600 hover:border-brand-500 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'}`}>{cat}</button>
          ))}
        </div>

        {fetching ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">Synchronizing Vault...</p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="panel py-20 text-center border-dashed border-2">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No certificates match your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <motion.div key={cert.id} className="glass-card flex overflow-hidden flex-col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="h-40 bg-slate-100 overflow-hidden relative border-b border-slate-200">
                  <img src={cert.cloudinaryUrl?.replace(/\.pdf$/i, '.jpg')} alt={cert.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/400x200/e2e8f0/475569?text=PDF' }} />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="line-clamp-1 text-lg font-black text-slate-950 dark:text-white">{cert.title}</h3>
                    {(cert.isInstitutional || cert.verificationStatus === 'verified') && (
                      <span className="flex items-center gap-1 text-[8px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-md dark:bg-brand-900/20 dark:text-brand-400 shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  <div className="flex flex-wrap gap-1 mt-auto mb-4">
                    {cert.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="chip rounded-md text-[10px]">{skill}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/certificate/${cert.id}`} className="flex-1 rounded-lg border border-slate-900/10 bg-white/70 py-2 text-center text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">View Details</Link>
                    <button onClick={() => handleShareOnLinkedIn(cert)} disabled={sharingId === cert.id} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition" title="AI Social Post">
                      {sharingId === cert.id ? <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div> : <Share2 className="w-5 h-5" />}
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowShareModal(false); setSharingId(null); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center"><Sparkles className="w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-slate-900">AI Achievement Post</h3>
                  </div>
                  <button onClick={() => { setShowShareModal(false); setSharingId(null); }} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap italic">"{generatedPost}"</p>
                  <button onClick={copyToClipboard} className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-400 hover:text-brand-600 transition">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => { 
                      copyToClipboard(); 
                      const shareProxyUrl = `${import.meta.env.VITE_API_URL}/api/share/${sharingId}`;
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareProxyUrl)}`, '_blank'); 
                    }} 
                    className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg hover:bg-brand-700 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" /> Copy & Share Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <ForcedUsernameModal 
          dbUser={dbUser} 
          user={user} 
          onUsernameSet={(newUsername) => setDbUser({ ...dbUser, username: newUsername })} 
        />
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
