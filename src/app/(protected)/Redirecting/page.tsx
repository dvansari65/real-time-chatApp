import React from "react";


function RedirectPage() {
  return (
    <div className="redirecting w-full h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          Please wait while we process your request
        </p>
        <div className="mt-6">
          <div className="inline-block h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default RedirectPage;
