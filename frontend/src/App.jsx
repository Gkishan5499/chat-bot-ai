import ChatWidget from './ChatWidget'

function App() {
  // Use a fallback key if the environment variable isn't set
  const apiKey = import.meta.env.VITE_WIDGET_API_KEY || "sk-test-demo";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar mock */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="font-bold text-2xl tracking-tighter text-indigo-600 flex items-center gap-2">
            <span className="text-3xl">🤖</span> BotFlow
        </div>
        <nav className="flex gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Products</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
        </nav>
        <div className="flex gap-4">
          <a href="http://localhost:5175/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center">Log in</a>
          <a href="http://localhost:5175/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">Sign up</a>
        </div>
      </header>

      {/* Hero mock */}
      <main className="max-w-6xl mx-auto px-8 py-24 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            The next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">online business.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
            Streamline your operations, integrate cutting-edge AI support, and boost your sales with our all-in-one scalable platform.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-1">
              Start Building Free
            </button>
            <button className="px-8 py-4 bg-white text-slate-900 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-sm">
              Read the Docs
            </button>
          </div>
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
              ))}
            </div>
            <span>Trusted by 10,000+ developers</span>
          </div>
        </div>

        {/* Abstract graphic */}
        <div className="flex-1 hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-violet-50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=600" alt="Dashboard" className="relative rounded-2xl shadow-2xl rotate-3 scale-110 object-cover w-[500px] h-[500px]" />
        </div>
      </main>

      {/* Embedded Chat Widget */}
      <ChatWidget apiKey={apiKey} color="#4F46E5" name="GautamAI BOT" />
    </div>
  )
}

export default App
