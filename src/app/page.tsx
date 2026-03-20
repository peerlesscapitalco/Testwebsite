import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const IMPACT_STATS = [
  { value: "$2.4M+", label: "Funds Raised" },
  { value: "150+", label: "Charities Supported" },
  { value: "10,000+", label: "Lives Impacted" },
  { value: "98%", label: "Funds Tracked" },
];

const CATEGORIES = [
  { icon: "🏠", title: "Shelter & Housing", desc: "Safe housing and transitional living programs for survivors" },
  { icon: "⚖️", title: "Legal Aid", desc: "Legal representation, protective orders, and court advocacy" },
  { icon: "💬", title: "Counseling & Therapy", desc: "Trauma-informed therapy and mental health support" },
  { icon: "🚨", title: "Emergency Services", desc: "Crisis hotlines, emergency relocation, and immediate safety" },
  { icon: "📚", title: "Education & Training", desc: "Job training, financial literacy, and empowerment programs" },
  { icon: "👶", title: "Children's Services", desc: "Support programs for children affected by domestic violence" },
];

const STEPS = [
  { step: "01", title: "Choose a Cause", desc: "Browse verified causes across specialized categories that matter to you." },
  { step: "02", title: "Make a Donation", desc: "Contribute any amount securely. 100% goes directly to the cause." },
  { step: "03", title: "Track Your Impact", desc: "Follow your donation's journey with detailed spending reports and impact metrics." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWNkgyVjRoMzR6TTIgMjRoMzR2Mkgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">150+ verified charities actively helping survivors</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Every Dollar Tracked.
              <br />
              <span className="text-primary-300">Every Life Changed.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              HopeFund connects compassionate donors with verified domestic violence charities.
              See exactly where your money goes and the real impact it creates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/donor/causes"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors text-lg"
              >
                Donate Now
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/register?role=charity_admin"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg"
              >
                Register Your Charity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Transparent giving in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all">
                <div className="text-5xl font-bold text-primary-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Specialized Causes</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Support the areas that matter most to you
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href={`/donor/causes?category=${cat.title.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}`}
                className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-primary-700">{cat.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-accent-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a donor looking to create impact or a charity seeking funding,
            HopeFund provides the transparency and trust you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              Start Donating
            </Link>
            <Link
              href="/register?role=charity_admin"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              Register as Charity
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
