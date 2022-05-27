DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  title TEXT,
  company TEXT,
  fav BOOLEAN,
  remote VARCHAR(6),
  zipcode INTEGER,
  wishlist BOOLEAN,
  applied BOOLEAN,
  phone_screen BOOLEAN,
  interviewed BOOLEAN,
  take_home BOOLEAN,
  technical_interview BOOLEAN,
  offer BOOLEAN,
  rejected BOOLEAN,
  accepted BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  url VARCHAR(256),
  description TEXT,
  notes TEXT,
  contact TEXT
);

INSERT INTO users (username, password_hash)
VALUES ('bop-simon', 'helloworld');
