import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  FileCheck2,
  FileSearch,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  MousePointer2,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(99,102,241,0.2),transparent_34%)]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />

        <div className="app-shell relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div className="eyebrow mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Verified credential intelligence
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Turn certificates into proof people can trust.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              CertiHub transforms certificate PDFs and images into a verified skills portfolio with AI extraction, career readiness insights, and a clean public profile.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/login" className="btn-primary px-8 py-4 text-base sm:text-lg">
                Build portfolio
                <ArrowRight className="h-5 w-5" />
              </Link>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Verify Credential ID..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      window.location.href = `/verify/${e.target.value}`;
                    }
                  }}
                  className="btn-secondary px-8 py-4 text-base sm:text-lg w-full sm:w-64 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity">
                  <ScanLine className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
              <Metric value="Extract" label="Certificate data" />
              <Metric value="Score" label="Career readiness" />
              <Metric value="Share" label="Verified profile" />
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[680px]"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="rounded-[2rem] border border-slate-900/10 bg-white p-4 shadow-[0_30px_120px_-45px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-slate-900">
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">CertiHub console</span>
                </div>

                <div className="border-b border-white/10 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-300">Live credential profile</p>
                      <h2 className="mt-2 text-2xl font-black">Professional Skill Passport</h2>
                    </div>
                    <div className="flex w-fit items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
                      <ShieldCheck className="h-4 w-4" />
                      Verified proof
                    </div>
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                          <FileCheck2 className="h-7 w-7" />
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-teal-200">PDF</span>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Uploaded certificate</p>
                      <h3 className="mt-2 text-2xl font-black">Advanced Web Development</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">Issuer, skills, date, and summary are extracted into structured proof.</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {['React', 'Cloud', 'APIs', 'Security'].map((skill) => (
                          <span key={skill} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-slate-200">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-4">
                      <Signal icon={<ScanLine className="h-4 w-4" />} title="OCR extraction" value="Completed" tone="text-brand-300" />
                      <Signal icon={<BadgeCheck className="h-4 w-4" />} title="Skill proof" value="Verified" tone="text-emerald-300" />
                      <Signal icon={<Target className="h-4 w-4" />} title="Best role fit" value="Software Developer" tone="text-teal-300" />
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Job Score</p>
                        <p className="text-sm font-black text-teal-300">86%</p>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-teal-300 via-brand-400 to-indigo-400" />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        Recommended next step: add one advanced cloud certificate to strengthen deployment readiness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-5 hidden rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900 sm:flex sm:items-center sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                <MousePointer2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">One link portfolio</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ready for recruiters</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="motive" className="bg-white py-20 dark:bg-slate-950 sm:py-24">
        <div className="app-shell">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <div className="eyebrow mb-5">Main motive</div>
              <h2 className="text-balance text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Make certificates useful for real career growth.
              </h2>
            </div>
            <div className="rounded-[1.75rem] border border-slate-900/10 bg-slate-50 p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xl font-bold leading-9 text-slate-700 dark:text-slate-200">
                CertiHub is built so learners and job seekers can convert certificate files into trusted proof: readable skills, AI summaries, career direction, and a shareable profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-100 py-20 dark:bg-slate-900 sm:py-24">
        <div className="app-shell">
          <div className="mb-12 max-w-3xl">
            <div className="eyebrow mb-5">What CertiHub does</div>
            <h2 className="section-title">From certificate upload to professional proof.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<UploadCloud className="h-7 w-7" />} title="Upload" desc="Add certificate PDFs or images from courses, internships, workshops, and achievements." />
            <FeatureCard icon={<FileSearch className="h-7 w-7" />} title="Extract" desc="AI reads important details like title, issuer, dates, names, and skills." />
            <FeatureCard icon={<BrainCircuit className="h-7 w-7" />} title="Understand" desc="Generate summaries, role suggestions, grouped skills, and readiness insights." />
            <FeatureCard icon={<Globe2 className="h-7 w-7" />} title="Share" desc="Publish a clean portfolio URL that is simple for recruiters and mentors to scan." />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950 sm:py-24">
        <div className="app-shell">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-white dark:border-white/10">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <h2 className="max-w-2xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
                A dashboard that explains achievement, not just stores uploads.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Every certificate becomes a structured record with skill tags, AI summaries, portfolio score, and role guidance.
              </p>
            </div>
            <div className="grid gap-5">
              <MiniCard icon={<ScanLine className="h-6 w-6" />} title="Read certificates" desc="Convert images and PDFs into useful credential data." />
              <MiniCard icon={<BarChart3 className="h-6 w-6" />} title="Measure readiness" desc="Show how the portfolio aligns with career goals." />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20 dark:bg-slate-900 sm:py-24">
        <div className="app-shell">
          <div className="grid gap-5 md:grid-cols-3">
            <BentoCard icon={<GraduationCap className="h-6 w-6" />} title="For students" desc="Show learning outcomes with organized certificate proof and clear skill highlights." />
            <BentoCard icon={<TrendingUp className="h-6 w-6" />} title="For job seekers" desc="Turn certificates into a recruiter-friendly profile with summaries and role fit." />
            <BentoCard icon={<BookOpenCheck className="h-6 w-6" />} title="For upskilling" desc="Find what to learn next based on the current certificate portfolio." />
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="app-shell">
          <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:p-12 lg:grid-cols-[1fr_0.48fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
                Stop sending plain certificate files. Share proof that explains itself.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Build a CertiHub portfolio and make every certificate easier to trust, understand, and use.
              </p>
            </div>
            <Link to="/login" className="btn-primary bg-white px-8 py-4 text-lg text-brand-700 hover:bg-slate-100">
              Start now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Metric = ({ value, label }) => (
  <div className="rounded-2xl border border-slate-900/10 bg-white/75 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
    <div className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">{value}</div>
    <div className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const Signal = ({ icon, title, value, tone }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
    <div className="flex items-center gap-3 text-slate-300">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">{icon}</span>
      <span className="text-sm font-bold">{title}</span>
    </div>
    <span className={`text-right text-sm font-black ${tone}`}>{value}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.article
    className="rounded-[1.5rem] border border-slate-900/10 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-600/25 dark:border-white/10 dark:bg-slate-950/70"
    whileHover={{ y: -6 }}
  >
    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-black text-slate-950 dark:text-white">{title}</h3>
    <p className="leading-7 text-slate-600 dark:text-slate-300">{desc}</p>
  </motion.article>
);

const MiniCard = ({ icon, title, desc }) => (
  <div className="rounded-[1.5rem] border border-slate-900/10 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.04]">
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-black text-slate-950 dark:text-white">{title}</h3>
    <p className="leading-7 text-slate-600 dark:text-slate-400">{desc}</p>
  </div>
);

const BentoCard = ({ icon, title, desc }) => (
  <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-7 dark:border-white/10 dark:bg-slate-950/70">
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-black text-slate-950 dark:text-white">{title}</h3>
    <p className="leading-7 text-slate-600 dark:text-slate-400">{desc}</p>
  </div>
);

export default Home;
