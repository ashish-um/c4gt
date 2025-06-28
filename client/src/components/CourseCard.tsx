import React from "react";

export interface Course {
  id: string;
  quantity?: {
    maximum?: {
      count?: number;
    };
  };
  descriptor: {
    name: string;
    short_desc?: string;
    long_desc?: string;
    images?: { url: string }[];
    media?: { url: string }[];
  };
  creator?: {
    descriptor: {
      name: string;
      short_desc?: string;
      long_desc?: string;
      images?: { url: string }[];
    };
  };
  price?: {
    currency: string;
    value: string;
  };
  category_ids?: string[];
  rating?: string;
  keywords?: string[];
  rateable?: boolean;
  tags?: Array<{
    descriptor: {
      code: string;
      name: string;
    };
    list: Array<{
      descriptor: {
        code: string;
        name?: string;
      };
      value: string;
    }>;
    display?: boolean;
  }>;
}

interface CourseCardProps {
  course: Course;
  categoryLabels?: Record<string, string>;
  languageLabels?: Record<string, string>;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  categoryLabels = {},
  languageLabels = {},
}) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 group transition hover:shadow-lg">
    <div className="relative">
      <img
        className="w-full h-40 object-cover"
        src={course.descriptor.images?.[0]?.url}
        alt={course.descriptor.name}
      />
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
        <svg
          className="w-3 h-3 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        {/* Show rating if available, else fallback to N/A */}
        <span className="font-bold">
          {course.rating ? `${course.rating}★` : "N/A"}
        </span>
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">
            {course.price?.currency} {course.price?.value}
          </p>
          <h3 className="font-bold text-gray-800 mt-1">
            {course.descriptor.name}
          </h3>
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
      <p className="text-sm text-gray-600 mt-2">
        {course.descriptor.short_desc}
      </p>
      {/* Chips for category_ids and tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Category chips */}
        {course.category_ids?.map((cat) => (
          <span
            key={cat}
            className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {categoryLabels[cat] || cat}
          </span>
        ))}
        {/* Tag chips */}
        {course.tags?.map((tag) =>
          tag.list
            .filter(
              (item) =>
                item.descriptor.name &&
                item.value &&
                (tag.display === undefined || tag.display)
            )
            .map((item, idx) => {
              let value = item.value;
              // Show language label if tag is lang-code
              if (item.descriptor.code === "lang-code" && languageLabels[value])
                value = languageLabels[value];
              return (
                <span
                  key={item.descriptor.code + item.value + idx}
                  className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {item.descriptor.name}: {value}
                </span>
              );
            })
        )}
      </div>
    </div>
  </div>
);

export default CourseCard;
