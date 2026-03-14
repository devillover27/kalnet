import { Link } from "react-router-dom";
import { BookOpen, Github, Twitter, Linkedin } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Master new skills with daily practice. Track your progress with our gamified
              streak system and join a community of passionate learners.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/courses" className="text-sm hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link to="/signup" className="text-sm hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
