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

// Helper function to find a specific tag value from a course
const getTagValue = (course: Course, code: string): string | undefined => {
  return course.tags
    ?.flatMap((tag) => tag.list)
    .find((item) => item.descriptor.code === code)?.value;
};

// Helper function to get the list of certifications a course awards
const getCertifications = (
  course: Course
): { name?: string; value: string }[] => {
  const certTagGroup = course.tags?.find(
    (tag) => tag.descriptor.code === "awarded-certifications"
  );
  return (
    certTagGroup?.list.map((cert) => ({
      name: cert.descriptor.name,
      value: cert.value,
    })) || []
  );
};

const CertificationPage: React.FC<CourseTypeProp> = ({
  course_type = "certification",
}: CourseTypeProp) => {
  const [courses, setCourses] = useState<Course[]>(data);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("q") || "");

  // Filter state
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const searchRequest = {
    context: {
      domain: "dsep:courses",
      action: "search",
      version: "1.1.0",
      bap_id: "test-id",
      bap_uri: "http://20.187.151.177:6002",
      bpp_id: "bpp-ashish",
      location: {
        city: { name: "Bangalore", code: "std:080" },
        country: { name: "India", code: "IND" },
      },
      transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62196",
      message_id: self.crypto.randomUUID(),
      ttl: "PT10M",
      timestamp: new Date().toISOString(),
    },
    message: {
      intent: {
        item: {
          descriptor: { name: search },
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

    // Animate progress bar
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
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
        setProgress(100);
        if (progressRef.current) clearTimeout(progressRef.current);
        if (response.data.length === 0) alert("No Certifications Found!");
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
    // Cleanup on unmount
    return () => {
      if (progressRef.current) clearTimeout(progressRef.current);
    };
  }, [searchParams]);

  // Frontend filtering logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (
        selectedLanguage &&
        getTagValue(course, "lang-code") !== selectedLanguage
      )
        return false;
      if (selectedCategory && !course.category_ids?.includes(selectedCategory))
        return false;
      if (
        selectedLevel &&
        getTagValue(course, "learner-level") !== selectedLevel
      )
        return false;
      return true;
    });
  }, [courses, selectedLanguage, selectedCategory, selectedLevel]);

  // ================== NEW GROUPING LOGIC ==================
  // This creates the nested structure: Certification -> Course Name -> [Items]
  const groupedByCertification = useMemo(() => {
    const certs: Record<string, Record<string, Course[]>> = {};

    filteredCourses.forEach((courseItem) => {
      const certifications = getCertifications(courseItem);
      const courseName =
        getTagValue(courseItem, "course-name") || "Uncategorized Course";

      certifications.forEach((cert) => {
        if (!certs[cert.value]) {
          certs[cert.value] = {};
        }
        if (!certs[cert.value][courseName]) {
          certs[cert.value][courseName] = [];
        }
        certs[cert.value][courseName].push(courseItem);
      });
    });

    return certs;
  }, [filteredCourses]);
  // ==========================================================

  // Function to generate a random Tailwind CSS border color from a predefined list
  // Tailwind JIT/AOT compilation means dynamic class names like `border-${color}-${shade}` won't work
  // unless they are explicitly present in the source code.
  // We'll use a fixed set of classes and pick one randomly.
  const getRandomBorderColor = () => {
    const colors = [
      "border-red-800",
      "border-blue-800",
      "border-green-800",
      "border-yellow-800",
      "border-purple-800",
      "border-pink-800",
      "border-indigo-800",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle form submit
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

        {/* ================== SEARCH AND FILTERS FORM RESTORED ================== */}
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
                    course_type === "course"
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
        {/* ======================================================================= */}

        {/* UPDATED CERTIFICATIONS GRID */}
        {loading ? (
          <></> // Show nothing while loading
        ) : Object.keys(groupedByCertification).length === 0 ? (
          <center className="mt-8 text-2xl text-gray-500">
            No Certifications Found!
          </center>
        ) : (
          <div className="space-y-16 mt-8">
            {/* Loop through each Certification group */}
            {Object.entries(groupedByCertification).map(
              ([certificationName, coursesInCert]) => (
                <div
                  key={certificationName}
                  className={`p-6 bg-white rounded-2xl border-2 ${getRandomBorderColor()} shadow-md`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      {/* Certification Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Certification
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {certificationName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Loop through each Course group within the Certification */}
                    <CompleteCourse groupedCourses={coursesInCert} />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CertificationPage;
