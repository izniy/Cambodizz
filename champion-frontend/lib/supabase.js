import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'; // required for RN support

const { SUPABASE_URL, SUPABASE_ANON_KEY } =
  Constants.expoConfig?.extra || Constants.manifest?.extra || {};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Key is missing!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);