import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
