import Link from "next/link"

export default function WelcomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "linear-gradient(to bottom, #2563eb, #60a5fa)",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Lightbulb Icon */}
      <div className="mb-12">
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="3" />
            <path d="M40 50 L60 50 M42 55 L58 55 M44 60 L56 60" stroke="black" strokeWidth="3" />
            <path d="M35 25 L45 35" stroke="black" strokeWidth="3" fill="none" />
          </svg>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="mb-16">
        <h1
          className="text-4xl font-bold mb-4"
          style={{
            color: "#ffffff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
          }}
        >
          WELCOME
        </h1>
        <h2
          className="text-2xl font-semibold"
          style={{
            color: "#ffffff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          ELECTRICITY BILL
        </h2>
      </div>

      {/* Navigation Button */}
      <Link
        href="/login"
        className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
      >
        Get Started
      </Link>
    </div>
  )
}
