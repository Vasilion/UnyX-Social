-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_club_member BOOLEAN DEFAULT FALSE,
  club_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  hours TEXT,
  price TEXT,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL
);

-- Create track_images table
CREATE TABLE IF NOT EXISTS track_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create track_reviews table
CREATE TABLE IF NOT EXISTS track_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(track_id, user_id)
);

-- Create posts table (for community content)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create comments table (for posts)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create discounts table (for UnyX Club)
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor TEXT NOT NULL,
  logo_url TEXT,
  offer TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  terms TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_discounts table (for tracking discount usage)
CREATE TABLE IF NOT EXISTS user_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  discount_id UUID REFERENCES discounts ON DELETE CASCADE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, discount_id)
);

-- Create club_subscriptions table
CREATE TABLE IF NOT EXISTS club_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create events table (for UnyX Club events)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  max_participants INTEGER,
  club_members_only BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  condition TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL
);

-- Create marketplace_images table
CREATE TABLE IF NOT EXISTS marketplace_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES marketplace_items ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create marketplace_messages table
CREATE TABLE IF NOT EXISTS marketplace_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES marketplace_items ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_tracks table (for tracking visited/favorite tracks)
CREATE TABLE IF NOT EXISTS user_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks ON DELETE CASCADE NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  visited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, track_id)
);

-- Create user_follows table (for following other users)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(follower_id, following_id)
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_name)
);

-- Create user_photos table (for profile gallery)
CREATE TABLE IF NOT EXISTS user_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create views for easier data access

-- View for tracks with images and average rating
CREATE OR REPLACE VIEW tracks_with_details AS
SELECT 
  t.*,
  (
    SELECT json_agg(json_build_object(
      'id', img.id,
      'storage_path', img.storage_path,
      'is_primary', img.is_primary
    ))
    FROM track_images img
    WHERE img.track_id = t.id
  ) AS images,
  (
    SELECT AVG(rating)::NUMERIC(10,1)
    FROM track_reviews
    WHERE track_id = t.id
  ) AS avg_rating,
  (
    SELECT COUNT(*)
    FROM track_reviews
    WHERE track_id = t.id
  ) AS review_count
FROM tracks t;

-- View for marketplace items with images and seller info
CREATE OR REPLACE VIEW marketplace_items_with_images AS
SELECT 
  i.*,
  p.username,
  p.avatar_url,
  (
    SELECT json_agg(json_build_object(
      'id', img.id,
      'storage_path', img.storage_path,
      'is_primary', img.is_primary
    ))
    FROM marketplace_images img
    WHERE img.item_id = i.id
  ) AS images
FROM marketplace_items i
JOIN profiles p ON i.user_id = p.id;

-- View for posts with user info and comment count
CREATE OR REPLACE VIEW posts_with_details AS
SELECT 
  p.*,
  u.username,
  u.avatar_url,
  (
    SELECT COUNT(*)
    FROM comments
    WHERE post_id = p.id
  ) AS comment_count
FROM posts p
JOIN profiles u ON p.user_id = u.id;

-- View for track reviews with user info
CREATE OR REPLACE VIEW track_reviews_with_user AS
SELECT 
  r.*,
  u.username,
  u.avatar_url
FROM track_reviews r
JOIN profiles u ON r.user_id = u.id;

-- Function to get user conversations
CREATE OR REPLACE FUNCTION get_user_conversations(user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  item_id UUID,
  item_title TEXT,
  other_user_id UUID,
  other_username TEXT,
  other_avatar_url TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH conversations AS (
    SELECT DISTINCT
      item_id,
      CASE
        WHEN sender_id = user_id THEN receiver_id
        ELSE sender_id
      END AS other_user_id
    FROM marketplace_messages
    WHERE sender_id = user_id OR receiver_id = user_id
  ),
  latest_messages AS (
    SELECT
      c.item_id,
      c.other_user_id,
      (
        SELECT message
        FROM marketplace_messages m
        WHERE (m.sender_id = user_id AND m.receiver_id = c.other_user_id)
           OR (m.sender_id = c.other_user_id AND m.receiver_id = user_id)
           AND m.item_id = c.item_id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message,
      (
        SELECT created_at
        FROM marketplace_messages m
        WHERE (m.sender_id = user_id AND m.receiver_id = c.other_user_id)
           OR (m.sender_id = c.other_user_id AND m.receiver_id = user_id)
           AND m.item_id = c.item_id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message_time,
      (
        SELECT COUNT(*)
        FROM marketplace_messages m
        WHERE m.sender_id = c.other_user_id
          AND m.receiver_id = user_id
          AND m.item_id = c.item_id
          AND m.read = FALSE
      ) AS unread_count
    FROM conversations c
  )
  SELECT
    uuid_generate_v4() AS conversation_id,
    lm.item_id,
    i.title AS item_title,
    lm.other_user_id,
    p.username AS other_username,
    p.avatar_url AS other_avatar_url,
    lm.last_message,
    lm.last_message_time,
    lm.unread_count
  FROM latest_messages lm
  JOIN marketplace_items i ON lm.item_id = i.id
  JOIN profiles p ON lm.other_user_id = p.id
  ORDER BY lm.last_message_time DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a user has a valid club membership
CREATE OR REPLACE FUNCTION is_club_member(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND is_club_member = TRUE
    AND (club_expires_at IS NULL OR club_expires_at > NOW())
  ) INTO is_member;
  
  RETURN is_member;
END;
$$ LANGUAGE plpgsql;

-- Function to award badges based on user activity
CREATE OR REPLACE FUNCTION award_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Trail Ripper badge (visited 10+ tracks)
  IF (
    SELECT COUNT(*) FROM user_tracks
    WHERE user_id = NEW.user_id AND visited_at IS NOT NULL
  ) >= 10 THEN
    INSERT INTO user_badges (user_id, badge_name, badge_description, badge_icon)
    VALUES (
      NEW.user_id,
      'Trail Ripper',
      'Completed 10+ different tracks',
      '/badges/trail-ripper.svg'
    )
    ON CONFLICT (user_id, badge_name) DO NOTHING;
  END IF;
  
  -- Review Pro badge (posted 20+ reviews)
  IF (
    SELECT COUNT(*) FROM track_reviews
    WHERE user_id = NEW.user_id
  ) >= 20 THEN
    INSERT INTO user_badges (user_id, badge_name, badge_description, badge_icon)
    VALUES (
      NEW.user_id,
      'Review Pro',
      'Posted 20+ reviews',
      '/badges/review-pro.svg'
    )
    ON CONFLICT (user_id, badge_name) DO NOTHING;
  END IF;
  
  -- Air Master badge (shared 5+ photos)
  IF (
    SELECT COUNT(*) FROM user_photos
    WHERE user_id = NEW.user_id
  ) >= 5 THEN
    INSERT INTO user_badges (user_id, badge_name, badge_description, badge_icon)
    VALUES (
      NEW.user_id,
      'Air Master',
      'Shared 5+ jump photos',
      '/badges/air-master.svg'
    )
    ON CONFLICT (user_id, badge_name) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for badge awards
CREATE TRIGGER track_visit_badge_trigger
AFTER INSERT OR UPDATE ON user_tracks
FOR EACH ROW
EXECUTE FUNCTION award_badges();

CREATE TRIGGER review_badge_trigger
AFTER INSERT ON track_reviews
FOR EACH ROW
EXECUTE FUNCTION award_badges();

CREATE TRIGGER photo_badge_trigger
AFTER INSERT ON user_photos
FOR EACH ROW
EXECUTE FUNCTION award_badges();

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tracks policies
CREATE POLICY "Tracks are viewable by everyone"
  ON tracks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tracks"
  ON tracks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Track creators can update their tracks"
  ON tracks FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Track creators can delete their tracks"
  ON tracks FOR DELETE
  USING (auth.uid() = created_by);

-- Track images policies
CREATE POLICY "Track images are viewable by everyone"
  ON track_images FOR SELECT
  USING (true);

CREATE POLICY "Track creators can add images"
  ON track_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tracks
      WHERE id = track_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Track creators can update images"
  ON track_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tracks
      WHERE id = track_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Track creators can delete images"
  ON track_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tracks
      WHERE id = track_id AND created_by = auth.uid()
    )
  );

-- Track reviews policies
CREATE POLICY "Track reviews are viewable by everyone"
  ON track_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON track_reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON track_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON track_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Discounts policies
CREATE POLICY "Club members can view discounts"
  ON discounts FOR SELECT
  USING (is_club_member(auth.uid()));

-- User discounts policies
CREATE POLICY "Users can view their own discount usage"
  ON user_discounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own discount usage"
  ON user_discounts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_club_member(auth.uid()));

-- Club subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON club_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions"
  ON club_subscriptions FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Event participants policies
CREATE POLICY "Users can view event participants"
  ON event_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can register for events"
  ON event_participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      (SELECT club_members_only FROM events WHERE id = event_id) = FALSE OR
      is_club_member(auth.uid())
    )
  );

CREATE POLICY "Users can cancel their event registration"
  ON event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Marketplace items policies
CREATE POLICY "Marketplace items are viewable by everyone"
  ON marketplace_items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own marketplace items"
  ON marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace items"
  ON marketplace_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace items"
  ON marketplace_items FOR DELETE
  USING (auth.uid() = user_id);

-- Marketplace images policies
CREATE POLICY "Marketplace images are viewable by everyone"
  ON marketplace_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their own items"
  ON marketplace_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_items
      WHERE id = item_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images for their own items"
  ON marketplace_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_items
      WHERE id = item_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for their own items"
  ON marketplace_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_items
      WHERE id = item_id AND user_id = auth.uid()
    )
  );

-- Marketplace messages policies
CREATE POLICY "Users can view messages they sent or received"
  ON marketplace_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send"
  ON marketplace_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received (to mark as read)"
  ON marketplace_messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- User tracks policies
CREATE POLICY "Users can view their own track history"
  ON user_tracks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own track history"
  ON user_tracks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own track history"
  ON user_tracks FOR UPDATE
  USING (auth.uid() = user_id);

-- User follows policies
CREATE POLICY "User follows are viewable by everyone"
  ON user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- User photos policies
CREATE POLICY "User photos are viewable by everyone"
  ON user_photos FOR SELECT
  USING (true);

CREATE POLICY "Users can upload their own photos"
  ON user_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON user_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON user_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('tracks', 'tracks', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('reviews', 'reviews', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('marketplace', 'marketplace', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user_photos', 'user_photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);

-- Set up storage policies
-- Avatars
CREATE POLICY "Avatars are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND owner = auth.uid());

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Tracks
CREATE POLICY "Track images are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tracks');

CREATE POLICY "Authenticated users can upload track images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'tracks' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own track images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'tracks' AND owner = auth.uid());

CREATE POLICY "Users can delete their own track images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'tracks' AND owner = auth.uid());

-- Reviews
CREATE POLICY "Review images are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reviews');

CREATE POLICY "Authenticated users can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reviews' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own review images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'reviews' AND owner = auth.uid());

CREATE POLICY "Users can delete their own review images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'reviews' AND owner = auth.uid());

-- Posts
CREATE POLICY "Post images are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'posts' AND owner = auth.uid());

CREATE POLICY "Users can delete their own post images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'posts' AND owner = auth.uid());

-- Marketplace
CREATE POLICY "Marketplace images are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketplace');

CREATE POLICY "Authenticated users can upload marketplace images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'marketplace' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own marketplace images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'marketplace' AND owner = auth.uid());

CREATE POLICY "Users can delete their own marketplace images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'marketplace' AND owner = auth.uid());

-- User photos
CREATE POLICY "User photos are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user_photos');

CREATE POLICY "Authenticated users can upload their photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user_photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'user_photos' AND owner = auth.uid());

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user_photos' AND owner = auth.uid());

-- Events
CREATE POLICY "Event images are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'events');

CREATE POLICY "Admins can manage event images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'events' AND auth.role() = 'service_role');

