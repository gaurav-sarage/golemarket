import Link from "next/link";
import { Facebook, Twitter, Instagram, Store, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 mt-auto overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand & Newsletter Column - Wider */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-primary-100 rounded-xl">
                                <Store className="h-7 w-7 text-primary-600" />
                            </div>
                            <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900">
                                GoleCentral
                            </span>
                        </Link>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                            Your unified digital marketplace. Shop from local favorites and experience authentic quality delivered directly to your doorstep.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="mt-2 w-full max-w-sm">
                            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Subscribe to updates</h4>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                                />
                                <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95">
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Discover</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 font-medium hover:text-primary-600 transition-colors flex items-center gap-2">About Us</Link></li>
                            <li><Link href="/shops" className="text-gray-500 font-medium hover:text-primary-600 transition-colors flex items-center gap-2">Browse Shops</Link></li>
                            <li><Link href="/categories" className="text-gray-500 font-medium hover:text-primary-600 transition-colors flex items-center gap-2">Categories</Link></li>
                        </ul>
                    </div>



                    {/* Legal & Contact Column */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-500 font-medium">
                                <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /> support@golecentral.local
                            </li>
                            <li className="flex items-start gap-3 text-gray-500 font-medium">
                                <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /> 1-800-456-7890
                            </li>
                            <li className="flex items-start gap-3 text-gray-500 font-medium">
                                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /> Made with ❤️ locally
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100 bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 font-medium text-sm text-center sm:text-left">
                        &copy; {new Date().getFullYear()} GoleCentral Marketplace. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
