import Link from "next/link"

export default function PaymentCompletedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col items-center justify-center px-6 text-center">
      {/* Success Icon */}
      <div className="mb-12">
        <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-white mb-2">PAYMENT</h1>
        <h2 className="text-3xl font-bold text-white">COMPLITED</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4 w-full max-w-xs">
        <Link
          href="/home"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition-colors block text-center"
        >
          Back to Home
        </Link>

        <Link
          href="/history"
          className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-lg text-lg transition-colors block text-center"
        >
          View History
        </Link>
      </div>
    </div>
  )
}
