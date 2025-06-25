import React from "react";

export interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  progress: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 group transition hover:shadow-lg">
    <div className="relative">
      <img
        className="w-full h-40 object-cover"
        src={course.image}
        alt={course.title}
      />
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
        <svg
          className="w-3 h-3 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span className="font-bold">{course.progress}%</span>
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">{course.price}</p>
          <h3 className="font-bold text-gray-800 mt-1">{course.title}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">{course.description}</p>
    </div>
  </div>
);

export default CourseCard;
