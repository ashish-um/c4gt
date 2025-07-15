import React, { useState } from "react";

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

// Helper: get certifications from tags
function getCertifications(course: Course): string[] {
  // Assuming certifications are in tags with code 'certification' or similar
  // Adjust this logic if your data structure is different
  const certs: string[] = [];
  course.tags?.forEach((tag) => {
    tag.list.forEach((item) => {
      if (item.descriptor.code?.toLowerCase().includes("cert") && item.value) {
        certs.push(item.value);
      }
    });
  });
  return certs;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const certifications = getCertifications(course);
  const [showTooltip, setShowTooltip] = useState(false);

  // Only keep "Course Duration" and "Course Type" tags for chips
  const tagChips =
    course.tags?.flatMap((tag) =>
      tag.list
        .filter(
          (item) =>
            (item.descriptor.code === "course-duration" ||
              item.descriptor.code === "course-type") &&
            item.descriptor.name &&
            item.value &&
            (tag.display === undefined || tag.display)
        )
        .map((item, idx) => (
          <span
            key={item.descriptor.code + item.value + idx}
            className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {item.descriptor.name}: {item.value}
          </span>
        ))
    ) || [];

  return (
    <a
      href={
        course.descriptor.media &&
        course.descriptor.media[0] &&
        course.descriptor.media[0].url
      }
      target="_blank"
      className="bg-white rounded-xl overflow-hidden border border-gray-200 group transition hover:shadow-lg relative"
    >
      {/* Certification badge */}
      {certifications.length > 0 && (
        <div
          className="absolute top-2 left-2 z-10 flex flex-col items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{ cursor: "pointer" }}
        >
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/trophy_78370-345.jpg?semt=ais_items_boosted&w=740"
              alt="Certification"
              className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow"
            />
            <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-white">
              {certifications.length}
            </span>
          </div>
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute left-12 top-0 bg-white border border-gray-300 rounded shadow-lg px-3 py-2 text-xs text-gray-800 z-20 min-w-max">
              <div className="font-semibold mb-1">Certifications:</div>
              <ul className="list-disc pl-4">
                {certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
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
        {/* Chips for category_ids and only Course Duration/Type tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Only Course Duration and Course Type tag chips */}
          {tagChips}
        </div>
      </div>
    </a>
  );
};

export default CourseCard;
