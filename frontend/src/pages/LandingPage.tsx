import { Link } from 'react-router-dom';
import { SparklesIcon, HeartIcon, CurrencyDollarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: <CurrencyDollarIcon className="h-8 w-8 text-primary" />, 
    title: 'Track Every Expense',
    description: 'Easily log and categorize your spending so you always know where your money goes.'
  },
  {
    icon: <HeartIcon className="h-8 w-8 text-accent" />, 
    title: 'Stay On Track',
    description: 'Set goals, see your progress, and get gentle reminders to help you stick to your plan.'
  },
  {
    icon: <SparklesIcon className="h-8 w-8 text-secondary" />, 
    title: 'Simple & Private',
    description: 'No ads, no selling your data. Just a tool to help you, built by someone who gets it.'
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative">
      {/* Top-right Login Link */}
      <div className="absolute top-6 right-8 z-10">
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline bg-white/80 px-4 py-2 rounded-lg shadow-sm transition"
        >
          Login
        </Link>
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-4">
          Take control of your money—finally.
        </h1>
        <p className="text-lg sm:text-xl text-center text-textSecondary max-w-2xl mb-8">
          Simple, private, and built for real life.
        </p>
        <Link
          to="/register"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-primary/90 transition text-lg"
        >
          Get Started Free
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-text mb-8">Everything you need to organize your finances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-background rounded-xl shadow hover:shadow-lg transition">
                {feature.icon}
                <h3 className="mt-4 text-lg font-semibold text-text text-center">{feature.title}</h3>
                <p className="mt-2 text-textSecondary text-center">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg text-text font-medium">
              All the main features are <span className="text-accent font-bold">free</span>—and always will be.
            </p>
            <p className="mt-2 text-textSecondary">
              If this app helps you, you can <span className="text-primary font-semibold">"buy me a drink"</span>—pay what you think is fair, only if you want.
            </p>
            <button
              className="mt-4 inline-block bg-accent text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-accent/90 transition text-base opacity-70 cursor-not-allowed"
              disabled
            >
              Buy me a drink (coming soon)
            </button>
          </div>
        </div>
      </section>

      {/* Premium/AI Teaser */}
      <section className="py-10 bg-gradient-to-r from-blue-50 via-emerald-50 to-white">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <LightBulbIcon className="h-10 w-10 text-primary mb-2" />
          <h3 className="text-xl font-bold text-text mb-2 text-center">Premium features coming soon</h3>
          <p className="text-textSecondary text-center">
            Soon, you'll get access to AI-powered tools to help you get out of debt and grow your money—always built with your real needs in mind.
          </p>
        </div>
      </section>

      {/* Personal/Empathy Extra Section */}
      <section className="py-6 bg-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-textSecondary text-base">
            Curious why I built this?<br />
            I know what it's like to feel lost with money. I made this app because I struggled too—and I wanted something simple, private, and truly helpful. If you're ready to get organized, you're in the right place.
          </p>
        </div>
      </section>

      {/* Personal Touch */}
      <footer className="py-6 text-center text-textSecondary text-sm">
        <span>Made with ❤️ by someone who's been there. You're not alone!</span>
      </footer>
    </div>
  );
} 