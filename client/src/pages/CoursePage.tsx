import React, { useEffect, useState, useMemo, useRef } from "react";
import FilterDropdown from "../components/FilterDropdown";
import type { Course } from "../components/CourseCard";
import { SearchIcon, MicIcon } from "../components/Icons";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import data from "../assets/testdata.json";

import {
  type CourseTypeProp,
  LANGUAGE_OPTIONS,
  LANGUAGE_LABELS,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  LEVEL_LABELS,
  LEVEL_OPTIONS,
} from "../components/MetaContent";
import CompleteCourse from "../components/CompleteCourse";

const CoursePage: React.FC<CourseTypeProp> = ({
  course_type = "course",
}: CourseTypeProp) => {
  const [courses, setCourses] = useState<Course[]>(data);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("q") || "");

  // Filter state
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // add env var reads
  const BAP_ID = import.meta.env.VITE_BAP_ID as string;
  const BAP_URI = import.meta.env.VITE_BAP_URI as string;
  const BPP_ID = import.meta.env.VITE_BPP_ID as string;

  const searchRequest = {
    context: {
      domain: "dsep:courses",
      action: "search",
      version: "1.1.0",
      bap_id: BAP_ID,
      bap_uri: BAP_URI,
      bpp_id: BPP_ID,
      location: {
        city: {
          name: "Bangalore",
          code: "std:080",
        },
        country: {
          name: "India",
          code: "IND",
        },
      },
      transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62196",
      message_id: self.crypto.randomUUID(),
      ttl: "PT10M",
      timestamp: new Date().toISOString(),
    },
    message: {
      intent: {
        item: {
          descriptor: {
            name: search,
          },
          tags: [
            {
              descriptor: { name: "search-type" },
              list: [{ value: course_type }],
            },
          ],
        },
      },
    },
  };

  // Progress bar state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchParams.get("q")) return;
    setLoading(true);
    setProgress(0);

    // Animate progress bar over 15 seconds
    const start = Date.now();
    const duration = 15000;
    function animate() {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
      if (percent < 100) {
        progressRef.current = setTimeout(animate, 100);
      }
    }
    animate();

    axios
      .post("http://localhost:3001/", searchRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
        setProgress(100);
        if (progressRef.current) clearTimeout(progressRef.current);
        if (response.data.length === 0) alert("No Courses Found!");
      })
      .catch((error) => {
        setLoading(false);
        setProgress(0);
        if (progressRef.current) clearTimeout(progressRef.current);
        console.error(
          "Search request failed:",
          error.response?.data || error.message
        );
      });
    // Cleanup on unmount or next request
    return () => {
      if (progressRef.current) clearTimeout(progressRef.current);
    };
  }, [searchParams]);

  // Filtering logic (frontend only)
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Language filter
      if (selectedLanguage) {
        const hasLang = course.tags?.some((tag) =>
          tag.list.some(
            (item) =>
              item.descriptor.code === "lang-code" &&
              item.value === selectedLanguage
          )
        );
        if (!hasLang) return false;
      }
      // Category filter
      if (selectedCategory) {
        if (!course.category_ids?.includes(selectedCategory)) return false;
      }
      // Level filter
      if (selectedLevel) {
        const hasLevel = course.tags?.some((tag) =>
          tag.list.some(
            (item) =>
              item.descriptor.code === "learner-level" &&
              item.value === selectedLevel
          )
        );
        if (!hasLevel) return false;
      }
      return true;
    });
  }, [courses, selectedLanguage, selectedCategory, selectedLevel]);

  // Helper function to find a specific tag value from a course
  const getTagValue = (course: Course, code: string): string | undefined => {
    return course.tags
      ?.flatMap((tag) => tag.list)
      .find((item) => item.descriptor.code === code)?.value;
  };

  // Add this block right after your 'filteredCourses' useMemo
  const groupedCourses = useMemo(() => {
    // The 'reduce' function is perfect for grouping arrays
    return filteredCourses.reduce((acc, course) => {
      // Find the main course name for grouping
      const courseName = getTagValue(course, "course-name") || "Uncategorized";

      // If this course name isn't a key in our accumulator object yet, create it
      if (!acc[courseName]) {
        acc[courseName] = [];
      }

      // Push the current course into the correct group
      acc[courseName].push(course);
      return acc;
    }, {} as Record<string, Course[]>); // The initial value is an empty object
  }, [filteredCourses]);

  // Handle form submit: update URL query param
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses([]);
    setSearchParams({ q: search });
  };

  return (
    <main className="flex-1 h-svh bg-gray-50/50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <h2 className="text-2xl font-semibold text-gray-800">
          ONDC/ONEST Skilling BAP Client
        </h2>

        <h2 className="text-2xl mt-5 mb-5 font-semibold text-gray-400">
          Search for {course_type}s:-
        </h2>

        {/* Progress Bar */}
        {loading && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-teal-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4 flex items-center">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder={
                    course_type == "course"
                      ? "Search for Skilling Modules & Courses..."
                      : "Search for Certifications..."
                  }
                  className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <MicIcon />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FilterDropdown
                label="Language"
                options={LANGUAGE_OPTIONS.map((code) => ({
                  value: code,
                  label: LANGUAGE_LABELS[code] || code,
                }))}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
              />
              <FilterDropdown
                label="Category/Topic"
                options={CATEGORY_OPTIONS.map((cat) => ({
                  value: cat,
                  label: CATEGORY_LABELS[cat] || cat,
                }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              <FilterDropdown
                label="Level"
                options={LEVEL_OPTIONS.map((lvl) => ({
                  value: lvl,
                  label: LEVEL_LABELS[lvl] || lvl,
                }))}
                value={selectedLevel}
                onChange={setSelectedLevel}
              />
              <button
                type="submit"
                className="w-full bg-teal-500 text-white font-semibold rounded-md py-2 px-4 hover:bg-teal-600 transition-colors text-sm"
              >
                APPLY
              </button>
            </div>
          </form>
        </div>

        {/* Courses Grid */}
        {/* Courses Grid - New Grouped Layout */}
        {loading ? (
          <></> // Show nothing while loading
        ) : Object.keys(groupedCourses).length === 0 ? (
          <center className="mt-8 text-2xl text-gray-500">
            No Courses Found!
          </center>
        ) : (
          <div className="space-y-12 mt-8">
            {/* Loop through the grouped courses object */}
            <CompleteCourse groupedCourses={groupedCourses} />
          </div>
        )}
      </div>
    </main>
  );
};

export default CoursePage;
