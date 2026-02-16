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
  // Alabama
  { value: "birmingham_al", label: "Birmingham, AL" },
  { value: "alabama", label: "Alabama (Other)" },
  // Alaska
  { value: "alaska", label: "Alaska" },
  // Arizona
  { value: "phoenix_metro", label: "Phoenix Metro, AZ" },
  { value: "tucson_az", label: "Tucson, AZ" },
  { value: "arizona", label: "Arizona (Other)" },
  // Arkansas
  { value: "arkansas", label: "Arkansas" },
  // California
  { value: "sf_bay_area", label: "SF Bay Area, CA" },
  { value: "la_metro", label: "Los Angeles, CA" },
  { value: "san_diego_metro", label: "San Diego, CA" },
  { value: "sacramento_ca", label: "Sacramento, CA" },
  { value: "inland_empire_ca", label: "Inland Empire, CA" },
  { value: "orange_county_ca", label: "Orange County, CA" },
  { value: "central_valley_ca", label: "Central Valley, CA" },
  { value: "california", label: "California (Other)" },
  // Colorado
  { value: "denver_metro", label: "Denver / Boulder, CO" },
  { value: "colorado", label: "Colorado (Other)" },
  // Connecticut
  { value: "connecticut", label: "Connecticut" },
  // Delaware
  { value: "delaware", label: "Delaware" },
  // Florida
  { value: "miami_metro", label: "Miami / Ft. Lauderdale, FL" },
  { value: "orlando_fl", label: "Orlando, FL" },
  { value: "tampa_fl", label: "Tampa / St. Pete, FL" },
  { value: "jacksonville_fl", label: "Jacksonville, FL" },
  { value: "florida", label: "Florida (Other)" },
  // Georgia
  { value: "atlanta_metro", label: "Atlanta Metro, GA" },
  { value: "georgia", label: "Georgia (Other)" },
  // Hawaii
  { value: "hawaii", label: "Hawaii" },
  // Idaho
  { value: "boise_id", label: "Boise, ID" },
  { value: "idaho", label: "Idaho (Other)" },
  // Illinois
  { value: "chicago_metro", label: "Chicago Metro, IL" },
  { value: "illinois", label: "Illinois (Other)" },
  // Indiana
  { value: "indianapolis_in", label: "Indianapolis, IN" },
  { value: "indiana", label: "Indiana (Other)" },
  // Iowa
  { value: "iowa", label: "Iowa" },
  // Kansas
  { value: "kansas", label: "Kansas" },
  // Kentucky
  { value: "louisville_ky", label: "Louisville, KY" },
  { value: "kentucky", label: "Kentucky (Other)" },
  // Louisiana
  { value: "new_orleans_la", label: "New Orleans, LA" },
  { value: "louisiana", label: "Louisiana (Other)" },
  // Maine
  { value: "maine", label: "Maine" },
  // Maryland
  { value: "baltimore_md", label: "Baltimore, MD" },
  { value: "maryland", label: "Maryland (Other)" },
  // Massachusetts
  { value: "boston_metro", label: "Boston Metro, MA" },
  { value: "massachusetts", label: "Massachusetts (Other)" },
  // Michigan
  { value: "detroit_metro", label: "Detroit Metro, MI" },
  { value: "ann_arbor_mi", label: "Ann Arbor, MI" },
  { value: "michigan", label: "Michigan (Other)" },
  // Minnesota
  { value: "twin_cities_mn", label: "Minneapolis / St. Paul, MN" },
  { value: "minnesota", label: "Minnesota (Other)" },
  // Mississippi
  { value: "mississippi", label: "Mississippi" },
  // Missouri
  { value: "stlouis_mo", label: "St. Louis, MO" },
  { value: "kansascity_mo", label: "Kansas City, MO" },
  { value: "missouri", label: "Missouri (Other)" },
  // Montana
  { value: "montana", label: "Montana" },
  // Nebraska
  { value: "omaha_ne", label: "Omaha, NE" },
  { value: "nebraska", label: "Nebraska (Other)" },
  // Nevada
  { value: "las_vegas_nv", label: "Las Vegas, NV" },
  { value: "reno_nv", label: "Reno, NV" },
  { value: "nevada", label: "Nevada (Other)" },
  // New Hampshire
  { value: "new_hampshire", label: "New Hampshire" },
  // New Jersey
  { value: "northern_nj", label: "Northern NJ (NYC area)" },
  { value: "new_jersey", label: "New Jersey (Other)" },
  // New Mexico
  { value: "albuquerque_nm", label: "Albuquerque, NM" },
  { value: "new_mexico", label: "New Mexico (Other)" },
  // New York
  { value: "nyc_metro", label: "New York City Metro, NY" },
  { value: "upstate_ny", label: "Upstate New York" },
  { value: "new_york", label: "New York (Other)" },
  // North Carolina
  { value: "charlotte_nc", label: "Charlotte, NC" },
  { value: "raleigh_durham_nc", label: "Raleigh / Durham, NC" },
  { value: "north_carolina", label: "North Carolina (Other)" },
  // North Dakota
  { value: "north_dakota", label: "North Dakota" },
  // Ohio
  { value: "columbus_oh", label: "Columbus, OH" },
  { value: "cleveland_oh", label: "Cleveland, OH" },
  { value: "cincinnati_oh", label: "Cincinnati, OH" },
  { value: "ohio", label: "Ohio (Other)" },
  // Oklahoma
  { value: "oklahoma_city_ok", label: "Oklahoma City, OK" },
  { value: "oklahoma", label: "Oklahoma (Other)" },
  // Oregon
  { value: "portland_metro", label: "Portland Metro, OR" },
  { value: "oregon", label: "Oregon (Other)" },
  // Pennsylvania
  { value: "philadelphia_pa", label: "Philadelphia, PA" },
  { value: "pittsburgh_pa", label: "Pittsburgh, PA" },
  { value: "pennsylvania", label: "Pennsylvania (Other)" },
  // Rhode Island
  { value: "rhode_island", label: "Rhode Island" },
  // South Carolina
  { value: "charleston_sc", label: "Charleston, SC" },
  { value: "south_carolina", label: "South Carolina (Other)" },
  // South Dakota
  { value: "south_dakota", label: "South Dakota" },
  // Tennessee
  { value: "nashville_tn", label: "Nashville, TN" },
  { value: "memphis_tn", label: "Memphis, TN" },
  { value: "tennessee", label: "Tennessee (Other)" },
  // Texas
  { value: "austin_metro", label: "Austin, TX" },
  { value: "houston_tx", label: "Houston, TX" },
  { value: "dallas_tx", label: "Dallas / Fort Worth, TX" },
  { value: "san_antonio_tx", label: "San Antonio, TX" },
  { value: "texas", label: "Texas (Other)" },
  // Utah
  { value: "salt_lake_city_ut", label: "Salt Lake City, UT" },
  { value: "utah", label: "Utah (Other)" },
  // Vermont
  { value: "vermont", label: "Vermont" },
  // Virginia
  { value: "dc_metro", label: "DC Metro / Northern VA" },
  { value: "richmond_va", label: "Richmond, VA" },
  { value: "virginia", label: "Virginia (Other)" },
  // Washington
  { value: "seattle_metro", label: "Seattle Metro, WA" },
  { value: "washington", label: "Washington (Other)" },
  // West Virginia
  { value: "west_virginia", label: "West Virginia" },
  // Wisconsin
  { value: "milwaukee_wi", label: "Milwaukee, WI" },
  { value: "madison_wi", label: "Madison, WI" },
  { value: "wisconsin", label: "Wisconsin (Other)" },
  // Wyoming
  { value: "wyoming", label: "Wyoming" },
  // Other
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
