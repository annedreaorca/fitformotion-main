export default function PaymentFailedPage() {
  return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
        <p className="text-zinc-400">
          Your payment could not be processed. Please try again.
        </p>
        <div className="mt-6">
          <a 
            href="/select-coach" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}