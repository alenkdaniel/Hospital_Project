import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, HeartPulse } from "lucide-react";

// Every link in this footer maps to a route that actually exists
// in AppRoutes.jsx. The previous version linked to /contact,
// /emergency, /specialties, /faq, /privacy, /terms, /cookies and
// social icons pointing at "#" — none of which resolve to
// anything, so they've been replaced with real destinations
// (or dropped where no real page/URL exists yet).
const Footer = () => {
  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                <HeartPulse size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">MediCare+</h2>
                <p className="text-sm text-ink-400">
                  Healthcare Management Platform
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-8 text-ink-400">
              Connecting patients with trusted, verified hospitals and
              experienced doctors through one secure healthcare platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link to="/" className="hover:text-brand-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-brand-400">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-brand-400">
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-brand-400">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 shrink-0 text-brand-400" size={20} />
                <p>Bangalore, Karnataka, India</p>
              </div>
              <div className="flex gap-3">
                <Phone className="shrink-0 text-brand-400" size={20} />
                <a href="tel:+918000000000" className="hover:text-brand-400">
                  +91 80000 00000
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="shrink-0 text-brand-400" size={20} />
                
                  <a href="mailto:support@medicare.com"
                  className="hover:text-brand-400"
                >
                  support@medicare.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-800 pt-8 text-sm text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MediCare+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;