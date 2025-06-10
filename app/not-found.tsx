import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">404 - Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400">Could not find the requested page</p>
      <Link 
        href="/" 
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
