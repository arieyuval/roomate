export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  major: string | null;
  gender: "male" | "female" | "non-binary" | "other" | null;
  location: string;
  region: string | null;
  same_gender_pref: "yes" | "no" | "no_preference";
  max_price: number | null;
  move_in_date: string | null;
  job_type: "internship" | "full_time" | null;
  bio: string | null;
  contact_info: string | null;
  photo_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  action: "interested" | "pass";
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface MatchWithProfile extends Match {
  profile: Profile;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface MatchWithProfileAndMessages extends MatchWithProfile {
  last_message: Message | null;
  my_message_count: number;
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  match_id?: string;
}
