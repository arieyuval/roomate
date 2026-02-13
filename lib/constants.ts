export const UW_COLORS = {
  purple: "#4B2E83",
  purpleDark: "#33145C",
  purpleLight: "#6A4FA0",
  gold: "#B7A57A",
  spiritGold: "#FFC700",
  goldLight: "#E8E3D3",
} as const;

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
] as const;

export const SAME_GENDER_PREF_OPTIONS = [
  { value: "yes", label: "Same gender only" },
  { value: "no", label: "Any gender" },
  { value: "no_preference", label: "No preference" },
] as const;

export const JOB_TYPE_OPTIONS = [
  { value: "internship", label: "Internship (summer)" },
  { value: "full_time", label: "Full-time" },
] as const;

export const POPULAR_LOCATIONS = [
  "Seattle, WA",
  "U District, Seattle",
  "Capitol Hill, Seattle",
  "Northgate, Seattle",
  "Ballard, Seattle",
  "Fremont, Seattle",
  "Bellevue, WA",
  "Redmond, WA",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Portland, OR",
  "New York, NY",
  "Chicago, IL",
  "Austin, TX",
] as const;

export const REGION_OPTIONS = [
  { value: "seattle_metro", label: "Seattle Metro" },
  { value: "sf_bay_area", label: "SF Bay Area" },
  { value: "la_metro", label: "Los Angeles Metro" },
  { value: "portland_metro", label: "Portland Metro" },
  { value: "nyc_metro", label: "NYC Metro" },
  { value: "chicago_metro", label: "Chicago Metro" },
  { value: "austin_metro", label: "Austin Metro" },
  { value: "boston_metro", label: "Boston Metro" },
  { value: "dc_metro", label: "DC Metro" },
  { value: "san_diego_metro", label: "San Diego Metro" },
  { value: "denver_metro", label: "Denver Metro" },
  { value: "other", label: "Other" },
] as const;

export const POPULAR_MAJORS = [
  "Computer Science",
  "Engineering",
  "Business",
  "Biology",
  "Psychology",
  "Communications",
  "Economics",
  "Political Science",
  "Mathematics",
  "Chemistry",
  "Physics",
  "English",
  "Design",
  "Informatics",
  "Nursing",
  "Public Health",
] as const;

export const MAX_PHOTOS = 4;
export const DEFAULT_PAGE_SIZE = 20;
