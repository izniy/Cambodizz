-- Create the vocabulary_words table
create table vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  english_word text not null,
  cham_word text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table vocabulary_words enable row level security;

-- Add a read-only public policy
create policy "Allow public read access"
  on vocabulary_words
  for select
  using (true);

-- Insert sample data
insert into vocabulary_words (english_word, cham_word, image_url)
values
  ('Water', 'Tuk', 'https://via.placeholder.com/100'),
  ('Sun', 'Atai', 'https://via.placeholder.com/100'),
  ('Tree', 'Dah', 'https://via.placeholder.com/100'),
  ('Bird', 'Tik', 'https://via.placeholder.com/100'),
  ('Fire', 'Phlai', 'https://via.placeholder.com/100'),
  ('Dog', 'Chkae', 'https://via.placeholder.com/100'),
  ('Rice', 'Bay', 'https://via.placeholder.com/100'),
  ('House', 'Phteah', 'https://via.placeholder.com/100'),
  ('Fish', 'Trey', 'https://via.placeholder.com/100'),
  ('Book', 'Seavphov', 'https://via.placeholder.com/100'); 