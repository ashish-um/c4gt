import React, { useEffect, useState, useMemo, useRef } from "react";
import FilterDropdown from "./FilterDropdown";
import CourseCard from "./CourseCard";
import type { Course } from "./CourseCard";
import { SearchIcon, MicIcon } from "./Icons";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const CATEGORY_LABELS: Record<string, string> = {
  "Banking-Financial": "Banking & Financial",
  "Education-Learning": "Education & Learning",
  "Health-Wellness": "Health & Wellness",
  "State-Scheme": "State Scheme",
  "Central-Scheme": "Central Scheme",
};

const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  mr: "Marathi",
};

const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Beginner",
  Advanced: "Advanced",
};

const CATEGORY_OPTIONS = [
  "Banking-Financial",
  "Education-Learning",
  "Health-Wellness",
  "State-Scheme",
  "Central-Scheme",
];
const LANGUAGE_OPTIONS = ["hi", "en", "mr"];
const LEVEL_OPTIONS = ["Beginner", "Advanced"];

const MainContent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("q") || "");

  // Filter state
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // Result type state
  const [resultType, setResultType] = useState<"course" | "certification">(
    "course"
  );

  const searchRequest = {
    context: {
      domain: "dsep:courses",
      action: "search",
      version: "1.1.0",
      bap_id: "test-id",
      bap_uri: "http://20.187.151.177:6002",
      bpp_id: "bpp-ashish",
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
              list: [{ value: resultType }],
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
              {/* Button group for result type */}
              <div className="mr-3 flex">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    resultType === "course"
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => {
                    setResultType("course");
                    setSearch("");
                  }}
                >
                  Course
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-r-md border-t border-b border-r border-gray-300 text-sm font-medium ${
                    resultType === "certification"
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => {
                    setResultType("certification");
                    setSearch("");
                  }}
                >
                  Certification
                </button>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search for Skilling Modules & Courses..."
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
        {loading ? (
          // Show nothing below the progress bar while loading
          <></>
        ) : courses.length === 0 ? (
          <center className="mt-4 text-2xl">No Courses Found!</center>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                categoryLabels={CATEGORY_LABELS}
                languageLabels={LANGUAGE_LABELS}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
