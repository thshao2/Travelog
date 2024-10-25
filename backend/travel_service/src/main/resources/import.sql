-- \c travel_db
-- INSERT INTO memories (id, user_id, caption_text, created_at, location_id) VALUES (1, 2, 'some caption', '2024-10-01 18:30:00', 3);
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9999, 1, 598769, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9000, 1, 565430, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9234, 2, 555670, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9678, 2, 576530, '2023-10-02 18:00:00');


INSERT INTO memories (id, user_id, pin_id, title, category, caption_text, init_date, end_date) VALUES (11111, 1, 9999, 'My title', 'Favorite', 'Visited the Eiffel Tower', '2023-10-01 10:00:00', '2023-10-02 18:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, caption_text, init_date, end_date) VALUES (22222, 1, 9911, 'My title', 'Favorite', 'Hiking in the Alps', '2023-09-25 09:00:00', '2023-09-27 17:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, caption_text, init_date, end_date) VALUES (33333, 1, 9999, 'My title', 'Wish', 'Beach vacation in Bali', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, caption_text, init_date, end_date) VALUES (44444, 2, 9000, 'My title', 'Wish', 'UCSC journal', '2023-09-10 12:00:00', '2023-09-12 20:00:00');