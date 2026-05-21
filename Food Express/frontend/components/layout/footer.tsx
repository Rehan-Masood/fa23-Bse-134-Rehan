'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="container-premium py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent mb-3">
              🍕 Food Express
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Premium food delivery service connecting you with the best restaurants.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start">
                <Phone size={16} className="mt-0.5 text-primary-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail size={16} className="mt-0.5 text-primary-400" />
                <span className="text-sm">support@foodexpress.com</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin size={16} className="mt-0.5 text-primary-400" />
                <span className="text-sm">123 Food Street, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-sm text-slate-400">
            © 2024 Food Express. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
