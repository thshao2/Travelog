-- \c travel_db
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9999, 1, 598769, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9000, 1, 565430, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9234, 2, 555670, '2023-10-02 18:00:00');
INSERT INTO pins (id, user_id, location_id, created_at) VALUES (9678, 2, 576530, '2023-10-02 18:00:00');


INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (11111, 1, 9999, 'Paris Trip', 'Favorite', 'Eiffel Tower', 'Visited', 'Visited the Eiffel Tower', '2023-10-01 10:00:00', '2023-10-02 18:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (22222, 1, 9000, 'Alps Trip', 'favorite', 'Alps', 'Planned', 'Hiking in the Alps', '2023-09-25 09:00:00', '2023-09-27 17:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (33333, 1, 9999, 'Bali Trip', 'Wish', 'Bali', 'Planned', 'Beach vacation in Bali', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (44444, 2, 9678, 'UCSC Life', 'wish', 'UCSC', 'Visited', 'UCSC journal', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (55555, 2, 9999, 'Hello', 'favorite', 'UCSC', 'Planned', 'Helloooooo', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (66666, 2, 9999, 'Journal', 'wish', 'UCSC', 'Visited', 'qwerty', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (77777, 3, 9999, 'tripsss', 'wish', 'UCSC', 'Planned', 'asdfg', '2023-09-10 12:00:00', '2023-09-12 20:00:00');
INSERT INTO memories (id, user_id, pin_id, title, category, loc, condition, caption_text, init_date, end_date) VALUES (88888, 3, 9999, 'travel', 'wish', 'UCSC', 'Visited', 'zxcv', '2023-09-10 12:00:00', '2023-09-12 20:00:00');