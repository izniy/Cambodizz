-- Drop the old table if needed
drop table if exists vocabulary_words;

-- Create the new version
create table vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  english_name text not null,
  cham_name text not null,
  image_url text,
  audio_url text,
  category_name text,
  created_at timestamp with time zone default now()
);

alter table vocabulary_words enable row level security;

create policy "Allow public read access"
  on vocabulary_words
  for select
  using (true);

insert into vocabulary_words (english_name, cham_name, image_url, audio_url, category_name)
values
  ('apple', 'ផ្លែប៉ោម', 'https://static.vecteezy.com/system/resources/thumbnails/016/940/260/small/apple-fruit-isolated-on-white-background-photo.jpg', 'https://example.com/audio/apple.mp3', 'fruits'),
  ('banana', 'ចេក', 'https://media.istockphoto.com/id/1154935375/photo/peeled-banana-on-white-background-photo-with-clipping-path.jpg?s=612x612&w=0&k=20&c=1k2Vczv77F2k6FhlFwL1xrtvQ1lq6_1aaO8Eo4rHKQ8=', 'https://example.com/audio/banana.mp3', 'fruits'),
  ('car', 'ឡាន', 'https://example.com/images/car.jpg', 'https://example.com/audio/car.mp3', 'vehicles'),
  ('dog', 'ឆ្កែ', 'https://example.com/images/dog.jpg', 'https://example.com/audio/dog.mp3', 'animals'),
  ('elephant', 'ដំរី', 'https://example.com/images/elephant.jpg', 'https://example.com/audio/elephant.mp3', 'animals'),
  ('fish', 'ត្រី', 'https://example.com/images/fish.jpg', 'https://example.com/audio/fish.mp3', 'animals'),
  ('giraffe', 'រមាស', 'https://example.com/images/giraffe.jpg', 'https://example.com/audio/giraffe.mp3', 'animals'),
  ('house', 'ផ្ទះ', 'https://example.com/images/house.jpg', 'https://example.com/audio/house.mp3', 'buildings'),
  ('ice', 'ទឹកកក', 'https://example.com/images/ice.jpg', 'https://example.com/audio/ice.mp3', 'weather'),
  ('juice', 'ទឹកផ្លែឈើ', 'https://example.com/images/juice.jpg', 'https://example.com/audio/juice.mp3', 'drinks');
