CREATE DATABASE user_db;
\c user_db
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO user_profile (user_id, email, bio, avatar_media_id, joined_at) 
VALUES (2, 'mollymember@gmail.com', 'test bio', NULL, '2023-05-15 14:30:00');