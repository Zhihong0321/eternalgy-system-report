import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6 text-center">Eternalgy System Report</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Track and analyze user interactions with your ERP system. Get insights into user productivity, 
        feature adoption, and system usage patterns.
      </p>
      
      <div className="space-y-4">
        <Link 
          href="/dashboard" 
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Dashboard
        </Link>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>POST /api/track</strong> - Track user interactions</li>
            <li><strong>POST /api/sync-users</strong> - Sync user data from ERP</li>
            <li><strong>GET /api/dashboard</strong> - Get dashboard statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
