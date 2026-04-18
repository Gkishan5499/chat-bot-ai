import { Link } from "react-router-dom";
import ChatWidget from "../ChatWidget";

export default function Home() {
  const apiKey = localStorage.getItem("widgetApiKey") || import.meta.env.VITE_WIDGET_API_KEY || "";
  const isAuth = !!localStorage.getItem("token");
  const primaryBtn =
    "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/25 transition hover:-translate-y-0.5";
  const secondaryBtn =
    "inline-flex items-center justify-center rounded-xl border border-slate-300/90 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white";
  const panelClass = "rounded-3xl border border-slate-200/90 bg-white/90 shadow-sm backdrop-blur";
  const container = "mx-auto w-full max-w-[1380px] px-4 md:px-6 lg:px-8";
  const sectionSpace = "mt-8 px-1 md:px-2";

  const benefits = [
    {
      id: "01",
      title: "Lead Capture That Never Sleeps",
      copy: "Engage every website visitor instantly and collect qualified leads 24/7, even when your team is offline.",
    },
    {
      id: "02",
      title: "Smart Qualification Flow",
      copy: "Ask intent-based questions, score leads automatically, and send your sales team only high-value conversations.",
    },
    {
      id: "03",
      title: "Faster Sales Decisions",
      copy: "Turn conversations into clear next steps with CTA prompts for booking demos, calls, and purchases.",
    },
  ];

  const packages = [
    {
      name: "Starter",
      price: "$19",
      desc: "Perfect for solo founders and small business websites.",
      points: ["1 website", "500 chats/month", "Basic qualification"],
      cta: "Choose Starter",
      popular: false,
    },
    {
      name: "Growth",
      price: "$49",
      desc: "Built for teams scaling inbound leads and sales calls.",
      points: ["3 websites", "4,000 chats/month", "Advanced workflows", "Priority support"],
      cta: "Choose Growth",
      popular: true,
    },
    {
      name: "Agency",
      price: "$99",
      desc: "Best for agencies managing multiple client websites.",
      points: ["Unlimited websites", "15,000 chats/month", "White-label options", "Dedicated onboarding"],
      cta: "Choose Agency",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_92%_18%,rgba(249,115,22,0.2),transparent_34%),linear-gradient(180deg,#f8fafc,#eef2ff_70%,#f8fafc)] pb-8">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-50/75 backdrop-blur-xl">
        <div className={`${container} flex items-center justify-between py-4`}>
          <div className="brand-title">
            <span className="brand-dot">AI</span>
            BotFlow
          </div>

          <div className="flex items-center gap-2">
            {isAuth ? (
              <Link to="/app" className={primaryBtn}>
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={`${secondaryBtn} hidden sm:inline-flex`}>
                  Log in
                </Link>
                <Link to="/register" className={primaryBtn}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={`${container} pb-6 pt-10`}>
        <section className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl md:p-9 xl:p-11">
          <div className="absolute -left-16 top-6 h-52 w-52 rounded-full bg-emerald-300/40 blur-3xl" />
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-orange-200/50 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:gap-8">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">AI Revenue Engine for Websites</p>
              <h1 className="font-(--font-head) text-4xl leading-[1.02] text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                Find clients who need a chatbot and
                <span className="block bg-linear-to-r from-emerald-700 via-teal-600 to-orange-500 bg-clip-text text-transparent">convert them automatically.</span>
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Built for modern businesses that want fewer missed opportunities. BotFlow engages visitors instantly, qualifies intent, and drives clear next actions.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link to={isAuth ? "/app" : "/register"} className={primaryBtn}>
                  {isAuth ? "Open Workspace" : "Start Free"}
                </Link>
                <Link to="/app/widget" className={secondaryBtn}>
                  Watch Live Widget
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4">
                  <p className="font-(--font-head) text-2xl text-slate-900">24/7</p>
                  <p className="mt-1 text-sm text-slate-500">Always-on engagement</p>
                </article>
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4">
                  <p className="font-(--font-head) text-2xl text-slate-900">1 Script</p>
                  <p className="mt-1 text-sm text-slate-500">Setup in minutes</p>
                </article>
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4">
                  <p className="font-(--font-head) text-2xl text-slate-900">Smart</p>
                  <p className="mt-1 text-sm text-slate-500">Lead qualification flow</p>
                </article>
              </div>
            </div>

            <div className="relative min-h-105 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-emerald-50 p-4">
              <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-orange-300/40 blur-2xl" />
              <div className="absolute -left-10 bottom-4 h-40 w-40 rounded-full bg-emerald-300/40 blur-2xl" />

              <div className="absolute left-4 top-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
                Conversion Console
              </div>

              <img
                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&q=80&w=900&h=900"
                alt="Team discussing customer support metrics"
                className="h-full w-full rounded-2xl object-cover shadow-2xl"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/90 p-4 backdrop-blur">
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500">Motto</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Find clients who need chatbot support on their website and convert faster.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionSpace} grid grid-cols-1 gap-4 md:grid-cols-3 mt-20`}>
          {benefits.map((item) => (
            <article key={item.id} className={`${panelClass} p-6`}>
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-emerald-700">{item.id}</p>
              <h3 className="mt-2 font-(--font-head) text-2xl leading-tight text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className={`${sectionSpace} grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]`}>
          <article className={`${panelClass} p-6 md:p-8`}>
            <h2 className="font-(--font-head) text-3xl text-slate-900">How BotFlow Moves Visitors to Clients</h2>
            <p className="mt-2 max-w-2xl text-slate-600">A simple flow that removes friction from first question to final sale.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.07em] text-orange-600">Step 1</p>
                <p className="mt-1.5 font-semibold text-slate-900">Install Widget</p>
                <p className="mt-1 text-sm text-slate-600">Paste one script and go live.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.07em] text-orange-600">Step 2</p>
                <p className="mt-1.5 font-semibold text-slate-900">Train Responses</p>
                <p className="mt-1 text-sm text-slate-600">Customize tone and qualification prompts.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.07em] text-orange-600">Step 3</p>
                <p className="mt-1.5 font-semibold text-slate-900">Close More Leads</p>
                <p className="mt-1 text-sm text-slate-600">Route sales-ready chats to your team.</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-800 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg shadow-slate-900/15 md:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-emerald-300">Client Results</p>
            <p className="mt-3 text-lg leading-relaxed text-slate-100">"BotFlow started qualifying leads from day one. We closed more demo calls without adding support staff."</p>
            <p className="mt-4 text-sm font-semibold text-slate-300">Maya Patel, Sales Lead</p>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="font-(--font-head) text-3xl">+43%</p>
              <p className="mt-1 text-sm text-slate-200">Increase in qualified website leads after chatbot deployment</p>
            </div>
          </article>
        </section>

        <section className={sectionSpace}>
          <div className="mb-3.5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-(--font-head) text-3xl text-slate-900">Packages</h2>
              <p className="mt-1 text-slate-600">Choose your growth plan and start converting your traffic.</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Cancel anytime</p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={pkg.popular
                  ? "relative flex h-full flex-col gap-2 rounded-[1.75rem] border border-emerald-600/50 bg-linear-to-b from-white to-emerald-50 p-6 shadow-lg shadow-emerald-700/15"
                  : `${panelClass} flex h-full flex-col gap-2 p-6`}
              >
                {pkg.popular && (
                  <p className="absolute right-5 top-4 rounded-full bg-emerald-700/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.05em] text-emerald-700">
                    Most Popular
                  </p>
                )}

                <p className="font-(--font-head) text-xl text-slate-900">{pkg.name}</p>
                <p className="font-(--font-head) text-4xl leading-none text-slate-900">
                  {pkg.price}
                  <span className="ml-1 text-sm font-semibold text-slate-500">/month</span>
                </p>
                <p className="text-sm text-slate-600">{pkg.desc}</p>

                <ul className="mt-1 flex flex-1 list-disc flex-col gap-1.5 pl-5 text-sm text-slate-700">
                  {pkg.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <Link to={isAuth ? "/app/billing" : "/register"} className={pkg.popular ? primaryBtn : secondaryBtn}>
                  {pkg.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={`${sectionSpace} rounded-[1.75rem] border border-slate-800 bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg shadow-slate-900/20 md:p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-(--font-head) text-3xl leading-tight">Start Turning Website Visitors Into Customers</h2>
              <p className="mt-2 max-w-3xl text-slate-300">Launch quickly, qualify leads automatically, and help your sales team focus on conversations that close.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to={isAuth ? "/app" : "/register"} className={primaryBtn}>
                {isAuth ? "Go To Dashboard" : "Get Started"}
              </Link>
              <Link to="/app/widget" className="inline-flex items-center justify-center rounded-xl border border-slate-500 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/70">
                Preview Widget
              </Link>
            </div>
          </div>
        </section>

        <section className={`${sectionSpace} relative min-h-108 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-linear-to-br from-white to-blue-50`}>
          <div className="absolute -left-8 top-10 h-52 w-52 rounded-full bg-teal-700/25 blur-md" />
          <div className="absolute bottom-6 right-10 h-44 w-44 rounded-full bg-orange-400/25 blur-md" />
          <img
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&q=80&w=900&h=900"
            alt="Team discussing customer support metrics"
            className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-2xl object-cover shadow-xl md:inset-6 md:h-[calc(100%-3rem)] md:w-[calc(100%-3rem)]"
          />
          <div className="absolute bottom-4 left-4 max-w-xs rounded-xl border border-slate-200/90 bg-white/92 p-3 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-extrabold text-slate-900">Built for Real Client Growth</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">Use AI chat to identify intent and move website conversations toward conversion.</p>
          </div>
        </section>
      </main>

      <ChatWidget apiKey={apiKey} color="#0f766e" name="BotFlow Assistant" localOnly={true} />
    </div>
  );
}
