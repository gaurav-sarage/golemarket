import Link from "next/link";
import { Facebook, Twitter, Instagram, Store } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Store className="h-8 w-8 text-primary-600" />
                        <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
                            GoleCentral
                        </span>
                    </Link>
                    <p className="text-gray-500 max-w-sm mb-6">
                        Your unified digital marketplace. Shop from local favorites, explore products, and experience authentic quality delivered directly to your doorstep.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/about" className="text-gray-500 hover:text-primary-600 transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-gray-500 hover:text-primary-600 transition-colors">Contact Us</Link>
                        </li>
                        <li>
                            <Link href="/shops" className="text-gray-500 hover:text-primary-600 transition-colors">Explore Shops</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 mb-4">For Partners</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/seller/register" className="text-gray-500 hover:text-primary-600 transition-colors">Open Your Shop</Link>
                        </li>
                        <li>
                            <Link href="/seller/login" className="text-gray-500 hover:text-primary-600 transition-colors">Seller Login</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} GoleCentral. All rights reserved.</p>
            </div>
        </footer>
    );
}
