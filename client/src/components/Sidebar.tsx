import React from "react";
import {
  CertIcon,
  CoursesIcon,
  AnalyticsIcon,
  DocsIcon,
  HelpIcon,
  AboutIcon,
} from "./Icons";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: <CoursesIcon />, label: "Courses", to: "/" },
  { icon: <CertIcon />, label: "Certifications", to: "/certifications" },
  { icon: <AnalyticsIcon />, label: "Analytics Dashboard", to: "/analytics" },
  { icon: <DocsIcon />, label: "API Docs", to: "/docs" },
  { icon: <HelpIcon />, label: "Help/Support", to: "/help" },
  { icon: <AboutIcon />, label: "About", to: "/about" },
];

const Sidebar: React.FC = () => {
  return (
    <>
      <div className="w-64 p-4 grow-0 shrink-0 basis-auto"></div>
      <div className="fixed top-0 left-0 bg-white border-r border-gray-200 w-64 p-4 flex flex-col justify-between min-h-screen">
        <div>
          <div className="mb-8 px-2">
            <h1 className="text-3xl font-bold text-gray-800">हक़दर्शक</h1>
            <p className="text-xl text-gray-500">Haqdarshak</p>
          </div>
          <nav>
            <ul>
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        isActive
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    end={item.to === "/"}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-gray-800">Tips & Tricks</h3>
            <p className="text-xs text-gray-500 mt-1 mb-3">
              Head on over to our website to get the latest tips & tricks!
            </p>
            <button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Learn More
            </button>
          </div>
          <div className="flex items-center space-x-3 border-t border-gray-200 pt-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg">
              ह
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Test User</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
