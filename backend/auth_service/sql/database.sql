CREATE DATABASE auth_db;
\c auth_db
-- CREATE TABLE account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);
-- INSERT INTO account(id, data) VALUES ('11111111-1111-1111-1111-111111111111', jsonb_build_object('email','emily@mail.com','name','Emily Ho'));