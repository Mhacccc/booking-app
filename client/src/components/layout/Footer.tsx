import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 pt-12 pb-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold text-lg select-none">StayScape</span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Find your next perfect stay. Plan trips, book hotel rooms, and manage booking schedules seamlessly.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">Explore</h4>
            <Link to="/hotels" className="text-sm hover:text-white transition-colors">
              Hotels & Resorts
            </Link>
            <Link to="/" className="text-sm hover:text-white transition-colors">
              Popular Cities
            </Link>
            <Link to="/hotels" className="text-sm hover:text-white transition-colors">
              Trending Destinies
            </Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">Support</h4>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Help Center
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Cancellation Options
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Trust & Safety
            </a>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">Legal</h4>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} StayScape Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors text-sm">
              English (US)
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm">
              $ USD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
