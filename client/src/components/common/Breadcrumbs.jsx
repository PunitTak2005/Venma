import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap = {
  products: "Products",
  categories: "Categories",
  vendors: "Vendors",
  vendor: "Vendor",
  cart: "Shopping Cart",
  checkout: "Checkout",
  orders: "My Orders",
  wishlist: "Wishlist",
  profile: "My Profile",
  contact: "Contact Us",
  login: "Login",
  register: "Register",
  dashboard: "Dashboard",
  admin: "Admin Console"
};

export default function Breadcrumbs({ customCrumbs }) {
  const location = useLocation();

  if (location.pathname === "/") return null;

  if (customCrumbs && customCrumbs.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-[#6B6B70] dark:text-[#A1A1AA]">
        <ol className="flex items-center flex-wrap gap-1 sm:gap-2">
          <li className="flex items-center">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[#C67C4E] dark:hover:text-[#D8956A] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          {customCrumbs.map((crumb, idx) => {
            const isLast = idx === customCrumbs.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1 sm:gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {isLast || !crumb.path ? (
                  <span className="font-semibold text-[#1C1C1E] dark:text-[#F8F7F5] truncate max-w-[200px] sm:max-w-xs">
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.path} className="hover:text-[#C67C4E] dark:hover:text-[#D8956A] transition-colors truncate max-w-[150px]">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-[#6B6B70] dark:text-[#A1A1AA]">
      <ol className="flex items-center flex-wrap gap-1 sm:gap-2">
        <li className="flex items-center">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[#C67C4E] dark:hover:text-[#D8956A] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayLabel = routeNameMap[value.toLowerCase()] || decodeURIComponent(value).replace(/-/g, " ");

          return (
            <li key={to} className="flex items-center gap-1 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast ? (
                <span className="font-semibold text-[#1C1C1E] dark:text-[#F8F7F5] capitalize truncate max-w-[220px]">
                  {displayLabel}
                </span>
              ) : (
                <Link to={to} className="hover:text-[#C67C4E] dark:hover:text-[#D8956A] capitalize transition-colors">
                  {displayLabel}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
