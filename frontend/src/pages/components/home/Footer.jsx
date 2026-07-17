import { Link } from "react-router-dom";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company */}

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <HeartPulse size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  MediCare+
                </h2>

                <p className="text-sm text-slate-400">
                  Healthcare Management Platform
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-8 text-slate-400">
              Connecting patients with trusted hospitals and experienced
              doctors through one secure healthcare platform.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <Facebook size={20} />
              </a>

              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <Instagram size={20} />
              </a>

              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <Twitter size={20} />
              </a>

              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About
                </Link>
              </li>

              <li>
                <Link to="/hospitals" className="hover:text-blue-400">
                  Hospitals
                </Link>
              </li>

              <li>
                <Link to="/doctors" className="hover:text-blue-400">
                  Doctors
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Services
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link to="/appointments" className="hover:text-blue-400">
                  Appointments
                </Link>
              </li>

              <li>
                <Link to="/emergency" className="hover:text-blue-400">
                  Emergency Care
                </Link>
              </li>

              <li>
                <Link to="/specialties" className="hover:text-blue-400">
                  Specialists
                </Link>
              </li>

              <li>
                <Link to="/reviews" className="hover:text-blue-400">
                  Reviews
                </Link>
              </li>

              <li>
                <Link to="/faq" className="hover:text-blue-400">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <MapPin className="text-blue-500" size={20} />
                <p>Bangalore, Karnataka, India</p>
              </div>

              <div className="flex gap-3">
                <Phone className="text-blue-500" size={20} />
                <a href="tel:+918000000000">
                  +91 80000 00000
                </a>
              </div>

              <div className="flex gap-3">
                <Mail className="text-blue-500" size={20} />
                <a href="mailto:support@medicare.com">
                  support@medicare.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} MediCare+. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-blue-400">
              Terms & Conditions
            </Link>

            <Link to="/cookies" className="hover:text-blue-400">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;