import React from "react";
import CourseCard, { type Course } from "./CourseCard";

interface CompleteCourseProps {
  groupedCourses: Record<string, Course[]>;
}

const CompleteCourse: React.FC<CompleteCourseProps> = ({ groupedCourses }) => {
  return (
    <>
      {Object.entries(groupedCourses).map(([courseName, coursesInGroup]) => (
        <div key={courseName}>
          {/* Render the main course name as a title for the group */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            {courseName}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {coursesInGroup[0].tags?.flatMap((tag) =>
              tag.list
                .filter(
                  (item) =>
                    (item.descriptor.code === "lang-code" ||
                      item.descriptor.code === "learner-level" ||
                      item.descriptor.code === "target-audience" ||
                      item.descriptor.code === "scheme-type") &&
                    item.descriptor.name &&
                    item.value &&
                    (tag.display === undefined || tag.display)
                )
                .map((item, idx) => (
                  <span
                    key={item.descriptor.code + item.value + idx}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {item.descriptor.name}: {item.value}
                  </span>
                ))
            )}
          </div>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {coursesInGroup.map((courseItem) => (
              <div
                key={courseItem.id}
                className="flex-shrink-0 flex w-80 md:w-96"
              >
                <CourseCard course={courseItem} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CompleteCourse;
