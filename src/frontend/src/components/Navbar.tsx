
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if we're on a dashboard page
  const isDashboard = location.pathname !== "/" && location.pathname !== "/forgot-password";

  const navigationItems = [
    { name: "Market Data", path: "/market-data" },
    { name: "OHRM-V1", path: "/ohrm-v1" },
    { name: "Profile", path: "/profile" },
    { name: "Risk Management", path: "/risk-management" },
    { name: "Positions", path: "/positions" },
    { name: "Trade Activity", path: "/trade-activity" },
    { name: "Book Trades", path: "/book-trades" },
    { name: "Compliance", path: "/compliance" },
    { name: "Import", path: "/import" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isDashboard ? "/positions" : "/"} className="text-xl font-bold text-primary flex items-center">
              <span className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </span>
              Orbix
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isDashboard ? (
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`text-sm ${
                    location.pathname === item.path
                      ? "text-primary font-medium"
                      : "text-gray-600 hover:text-primary"
                  } transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                About us
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 flex flex-col">
            {isDashboard ? (
              navigationItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`py-2 ${
                    location.pathname === item.path
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2">
                  Home
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors py-2">
                  About us
                </Link>
                <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors py-2">
                  Blog
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors py-2">
                  Pricing
                </Link>
                <Link to="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
