import { supabase } from './supabase';

export async function getVocabularyWords() {
  const { data, error } = await supabase
    .from('vocabulary_words')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching vocabulary:', error);
    return [];
  }

  return data;
} 