import LoadingSpinner from './LoadingSpinner';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-700 uppercase tracking-wider text-sm">Loading...</p>
      </div>
    </div>
  );
}
