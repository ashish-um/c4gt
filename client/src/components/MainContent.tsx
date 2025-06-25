import React from "react";
import FilterDropdown from "./FilterDropdown";
import CourseCard from "./CourseCard";
import type { Course } from "./CourseCard";
import { SearchIcon, MicIcon } from "./Icons";

const courses: Course[] = [
  {
    id: 1,
    title: "Introduction to Python Course",
    description: "Master Python fundamentals and advanced concepts...",
    price: "INR 499",
    image: "https://placehold.co/600x400/DBF0FE/333333?text=Python+Course",
    progress: 100,
  },
  {
    id: 2,
    title: "Conversational Hindi for Beginners",
    description: "Master Hindi fundamentals through hands-on...",
    price: "INR 499",
    image: "https://placehold.co/600x400/E9D5FF/333333?text=Learn+Hindi",
    progress: 100,
  },
  {
    id: 3,
    title: "Digital Marketing Fundamentals",
    description: "Master Digital Marketing fundamentals and advanced...",
    price: "INR 499",
    image: "https://placehold.co/600x400/D1FAE5/333333?text=Digital+Marketing",
    progress: 100,
  },
  {
    id: 4,
    title: "Effective Communication for Professionals",
    description: "A practical communication course for success at work.",
    price: "INR 499",
    image: "https://placehold.co/600x400/A5F3FC/333333?text=Communication",
    progress: 100,
  },
];

const MainContent: React.FC = () => (
  <main className="flex-1 bg-gray-50/50 p-6 sm:p-8">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          ONDC/ONEST Skilling BAP Client
        </h2>
        <button className="bg-teal-500 text-white rounded-lg p-2 hover:bg-teal-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search for Skilling Modules & Courses..."
            className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <MicIcon />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FilterDropdown label="Language" />
          <FilterDropdown label="Category/Topic" />
          <FilterDropdown label="Level" />
          <button className="w-full bg-teal-500 text-white font-semibold rounded-md py-2 px-4 hover:bg-teal-600 transition-colors text-sm">
            APPLY
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  </main>
);

export default MainContent;
