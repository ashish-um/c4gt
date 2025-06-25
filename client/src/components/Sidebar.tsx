import React from "react";
import {
  HomeIcon,
  CoursesIcon,
  AnalyticsIcon,
  DocsIcon,
  HelpIcon,
  AboutIcon,
} from "./Icons";

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: <HomeIcon />, label: "Home", active: true },
    { icon: <CoursesIcon />, label: "Courses/Enrollments" },
    { icon: <AnalyticsIcon />, label: "Analytics Dashboard" },
    { icon: <DocsIcon />, label: "API Docs" },
    { icon: <HelpIcon />, label: "Help/Support" },
    { icon: <AboutIcon />, label: "About" },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 p-4 flex flex-col justify-between min-h-screen">
      <div>
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-gray-800">हक़दर्शक</h1>
          <p className="text-sm text-gray-500">Haqdarshak</p>
        </div>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    item.active
                      ? "bg-teal-50 text-teal-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
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
  );
};

export default Sidebar;
