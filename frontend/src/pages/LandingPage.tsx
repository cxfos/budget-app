import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Welcome to Budget App</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Take control of your finances with our easy-to-use budgeting tool.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/login"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:from-green-500 hover:to-blue-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 