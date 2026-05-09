export function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}