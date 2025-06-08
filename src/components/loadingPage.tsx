// src/components/LoadingPage.tsx

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
        <p className="text-lg font-semibold">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
