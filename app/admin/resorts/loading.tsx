export default function AdminResortsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
