import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="mb-8">
          <Link href="/" className="hover:text-blue-400 flex items-center gap-2 transition-colors duration-200">
            <BookOpen size={24} className="text-yellow-700" />
            <span className="text-lg font-bold">
              <span className="text-yellow-700">Book</span>
              <span className="text-blue-700 font-bold">Heaven</span>
            </span>
          </Link>     
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Contact Us Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">Contact Us</h2>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <span className="font-medium text-white">Email:</span>
                <span className="ml-2">hajiraj475@gmail.com</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium text-white">Phone:</span>
                <span className="ml-2">+265 986 654 764</span>
              </p>
            </div>
          </div>

          {/* About Us Section */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">About Us</h2>
            <p className="text-gray-300 leading-relaxed">
              We offer books that change your mindset completely and can lead you to a better life. 
              Discover transformative literature that inspires personal growth and opens new perspectives.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 BookHeaven. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};