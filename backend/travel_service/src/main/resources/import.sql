-- \c travel_db
INSERT INTO locations (id, latitude, longitude) VALUES (598769, 37.7749, -122.4194);
INSERT INTO locations (id, latitude, longitude) VALUES (565430, 34.0522, -118.2437);
INSERT INTO locations (id, latitude, longitude) VALUES (555670, 40.7128, -74.0060);
INSERT INTO locations (id, latitude, longitude) VALUES (576530, 48.8566, 2.3522);

INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9999, 1, 598769, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9000, 1, 565430, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9234, 2, 555670, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9678, 2, 576530, '2023-10-02 18:00:00');


INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (11111, 1, 9999, 'SF Trip', 'Favorite', 'Eiffel Tower', 'Visited', 'Visited the Eiffel Tower', '2023-10-01 10:00:00', '2023-10-02 18:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (22222, 1, 9000, 'LA Trip', 'favorite', 'Alps', 'Planned', 'Hiking in the Alps', '2023-09-25 09:00:00', '2023-09-27 17:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (33333, 1, 9888, 'HK Trip', 'Wish', 'hk', 'Planned', 'Beach vacation in Bali', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (44444, 2, 9678, 'Paris Life', 'wish', 'paris', 'Visited', 'UCSC journal', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (55555, 2, 9234, 'NYC', 'favorite', 'new york', 'Planned', 'Helloooooo', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (66666, 2, 9812, 'Journal', 'wish', 'UCSC', 'Visited', 'qwerty', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (77777, 3, 9898, 'tripsss', 'wish', 'UCSC', 'Planned', 'asdfg', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (88888, 3, 9866, 'travel', 'wish', 'UCSC', 'Visited', 'zxcv', '2023-09-10 12:00:00', '2023-09-12 20:00:00');