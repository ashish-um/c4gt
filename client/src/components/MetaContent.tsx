export interface CourseTypeProp {
  course_type?: "course" | "certification";
}

export const CATEGORY_LABELS: Record<string, string> = {
  "Banking-Financial": "Banking & Financial",
  "Education-Learning": "Education & Learning",
  "Health-Wellness": "Health & Wellness",
  "State-Scheme": "State Scheme",
  "Central-Scheme": "Central Scheme",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  mr: "Marathi",
};

export const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Beginner",
  Advanced: "Advanced",
};

export const CATEGORY_OPTIONS = [
  "Banking-Financial",
  "Education-Learning",
  "Health-Wellness",
  "State-Scheme",
  "Central-Scheme",
];
export const LANGUAGE_OPTIONS = ["hi", "en", "mr"];
export const LEVEL_OPTIONS = ["Beginner", "Advanced"];
