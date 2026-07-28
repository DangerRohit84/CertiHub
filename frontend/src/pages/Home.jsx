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
  LockKeyhole,
  MousePointer2,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  Zap,
  Users,
  Award,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgb(var(--app-bg))]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-400/15 via-brand-500/5 to-transparent rounded-full blur-3xl" />

        <div className="app-shell relative z-10 py-32 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="eyebrow mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Credential Intelligence
              </div>
              
              <h1 className="text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                Turn certificates into{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet bg-clip-text text-transparent">
                    proof
                  </span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-brand-200/50 dark:bg-brand-500/20 -rotate-1 rounded-full" />
                </span>{' '}
                people can trust.
              </h1>
              
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
                CertiHub transforms certificate PDFs and images into a verified skills portfolio with AI extraction, career readiness insights, and a clean public profile.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/login" className="btn-primary px-8 py-4 text-base">
                  Build your portfolio
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
                    className="btn-secondary px-8 py-4 text-base w-full sm:w-72 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">
                    <ScanLine className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="mt-14 flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['bg-brand-500', 'bg-accent-emerald', 'bg-accent-violet', 'bg-accent-amber'].map((color, i) => (
                      <div key={i} className={`h-9 w-9 rounded-full ${color} border-2 border-white dark:border-slate-950 flex items-center justify-center text-white text-xs font-bold`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">2,400+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Verified professionals</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">99.4%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">AI accuracy</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative rounded-[2rem] border border-slate-200/60 bg-white p-3 shadow-heavy dark:border-white/[0.08] dark:bg-slate-900">
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">CertiHub Console</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">Live Credential Profile</p>
                        <h2 className="mt-1.5 text-2xl font-black">Professional Skill Passport</h2>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-sm font-bold text-emerald-300">
                        <ShieldCheck className="h-4 w-4" />
                        Verified
                      </div>
                    </div>

                    <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                      <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:border-white/10">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                              <FileCheck2 className="h-6 w-6" />
                            </div>
                            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-300">PDF</span>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Uploaded Certificate</p>
                          <h3 className="mt-1.5 text-xl font-black">Advanced Web Development</h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-400">Issuer, skills, date, and summary extracted into structured proof.</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {['React', 'Cloud', 'APIs', 'Security'].map((skill) => (
                              <span key={skill} className="rounded-lg bg-white/[0.08] px-2.5 py-1.5 text-xs font-bold text-slate-300">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <Signal icon={<ScanLine className="h-4 w-4" />} title="OCR extraction" value="Completed" tone="text-brand-300" />
                        <Signal icon={<BadgeCheck className="h-4 w-4" />} title="Skill proof" value="Verified" tone="text-emerald-300" />
                        <Signal icon={<Target className="h-4 w-4" />} title="Best role fit" value="Software Developer" tone="text-brand-300" />

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Job Score</p>
                            <p className="text-sm font-black text-emerald-300">86%</p>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-emerald-400 via-brand-400 to-accent-violet" />
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-slate-400">
                            Add one cloud certificate to strengthen deployment readiness.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 left-4 hidden rounded-xl border border-slate-200/60 bg-white px-4 py-3 shadow-medium dark:border-white/[0.08] dark:bg-slate-900 sm:flex items-center gap-3 animate-float-gentle">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <MousePointer2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">One-link portfolio</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ready for recruiters</p>
                </div>
              </div>

              <div className="absolute -top-4 right-4 hidden rounded-xl border border-slate-200/60 bg-white px-4 py-3 shadow-medium dark:border-white/[0.08] dark:bg-slate-900 sm:flex items-center gap-3 animate-float-gentle" style={{ animationDelay: '1s' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">AI Analysis</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instant extraction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-slate-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02]">
        <div className="app-shell">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {[
              { icon: <Users className="h-5 w-5" />, value: '2,400+', label: 'Professionals' },
              { icon: <Award className="h-5 w-5" />, value: '8,500+', label: 'Certificates' },
              { icon: <ShieldCheck className="h-5 w-5" />, value: '99.4%', label: 'Accuracy' },
              { icon: <Globe2 className="h-5 w-5" />, value: '50+', label: 'Countries' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-brand-500 dark:text-brand-400">{stat.icon}</div>
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="app-shell">
          <div className="mb-16 max-w-3xl">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="section-title">From upload to verified proof in seconds.</h2>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
              Our AI engine reads your certificates, extracts verified data, and builds a professional profile you can share anywhere.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <UploadCloud className="h-7 w-7" />, title: 'Upload', desc: 'Add certificate PDFs or images from courses, internships, and achievements.', color: 'from-brand-500 to-brand-600' },
              { icon: <FileSearch className="h-7 w-7" />, title: 'Extract', desc: 'AI reads title, issuer, dates, names, and skills with 99%+ accuracy.', color: 'from-accent-emerald to-emerald-600' },
              { icon: <BrainCircuit className="h-7 w-7" />, title: 'Understand', desc: 'Generate summaries, role suggestions, and career readiness insights.', color: 'from-accent-violet to-violet-600' },
              { icon: <Globe2 className="h-7 w-7" />, title: 'Share', desc: 'Publish a clean portfolio URL for recruiters and mentors to scan.', color: 'from-accent-amber to-amber-600' },
            ].map((feature, i) => (
              <article key={i} className="group glass-card p-7 cursor-pointer">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-black text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="app-shell">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="eyebrow mb-5">Dashboard</div>
              <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                A dashboard that explains achievement, not just stores uploads.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Every certificate becomes a structured record with skill tags, AI summaries, portfolio score, and role guidance.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Read certificates</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Convert images and PDFs into useful data.</p>
                </div>
                <div className="glass-card p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Measure readiness</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">See how your portfolio aligns with goals.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-slate-200/60 bg-white p-3 shadow-heavy dark:border-white/[0.08] dark:bg-slate-900">
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-50 p-6 dark:bg-slate-950">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">My Workspace</h3>
                    <div className="flex gap-2">
                      {['All', 'Verified', 'Personal'].map((tab, i) => (
                        <span key={tab} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i === 0 ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>{tab}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1,2,3].map((i) => (
                      <div key={i} className="rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-3">
                        <div className="h-20 rounded-lg bg-slate-100 dark:bg-white/[0.06] mb-3" />
                        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-white/10 mb-2" />
                        <div className="h-2 w-1/2 rounded bg-slate-100 dark:bg-white/[0.06]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 lg:py-32">
        <div className="app-shell">
          <div className="text-center mb-16">
            <div className="eyebrow mb-5 mx-auto w-fit">Built for everyone</div>
            <h2 className="section-title">One platform, every career stage.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <GraduationCap className="h-6 w-6" />, title: 'For students', desc: 'Show learning outcomes with organized certificate proof and clear skill highlights.', gradient: 'from-brand-500 to-brand-600' },
              { icon: <TrendingUp className="h-6 w-6" />, title: 'For job seekers', desc: 'Turn certificates into a recruiter-friendly profile with summaries and role fit.', gradient: 'from-accent-emerald to-emerald-600' },
              { icon: <BookOpenCheck className="h-6 w-6" />, title: 'For upskilling', desc: 'Find what to learn next based on your current certificate portfolio.', gradient: 'from-accent-violet to-violet-600' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 group cursor-pointer">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="mb-3 text-xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="app-shell">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-10 sm:p-16 text-white">
            <div className="absolute inset-0 hero-grid opacity-20" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-brand-500/20 via-transparent to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h2 className="max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
                  Stop sending plain certificate files. Share proof that explains itself.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                  Build a CertiHub portfolio and make every certificate easier to trust, understand, and use.
                </p>
              </div>
              <Link to="/login" className="btn-primary bg-white px-10 py-5 text-lg text-brand-700 hover:bg-slate-100 shrink-0">
                Start now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Signal = ({ icon, title, value, tone }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
    <div className="flex items-center gap-2.5 text-slate-300">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08]">{icon}</span>
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <span className={`text-right text-sm font-bold ${tone}`}>{value}</span>
  </div>
);

export default Home;
