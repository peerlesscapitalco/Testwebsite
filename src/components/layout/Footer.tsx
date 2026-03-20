import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Hope<span className="text-primary-400">Fund</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Connecting compassionate donors with verified domestic violence charities.
              Every dollar is tracked, every impact is measured, every life matters.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Donors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/donor/causes" className="hover:text-white transition-colors">Browse Causes</Link></li>
              <li><Link href="/donor/tracking" className="hover:text-white transition-colors">Track Your Impact</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Charities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register?role=charity_admin" className="hover:text-white transition-colors">Register Organization</Link></li>
              <li><Link href="/charity/dashboard" className="hover:text-white transition-colors">Charity Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HopeFund. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
