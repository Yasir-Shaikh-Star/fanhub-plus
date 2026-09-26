
CREATE TABLE users (
  id                CHAR(12)      PRIMARY KEY,
  name              VARCHAR(120)  NOT NULL,
  email             VARCHAR(180)  NOT NULL UNIQUE,
  password_hash     VARCHAR(160)  NOT NULL,
  role              VARCHAR(20)   NOT NULL DEFAULT 'registered',
  bio               VARCHAR(220),
  avatar            TEXT,
  theme             VARCHAR(10)   DEFAULT 'light',
  font_size         VARCHAR(5)    DEFAULT 'md',
  reset_token       VARCHAR(64),
  reset_token_expiry BIGINT,
  created_at        DATETIME      NOT NULL
);

CREATE TABLE categories (
  id           CHAR(12)      PRIMARY KEY,
  slug         VARCHAR(30)   NOT NULL UNIQUE,
  name         VARCHAR(60)   NOT NULL,
  description  VARCHAR(200)
);

CREATE TABLE user_favorite_categories (
  user_id      CHAR(12) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  CHAR(12) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, category_id)
);

CREATE TABLE content (
  id                CHAR(12)      PRIMARY KEY,
  category_id       CHAR(12)      NOT NULL REFERENCES categories(id),
  title             VARCHAR(160)  NOT NULL,
  type              VARCHAR(10)   NOT NULL,
  description       VARCHAR(300),
  body              TEXT,
  media_url         TEXT,
  status            VARCHAR(10)   NOT NULL DEFAULT 'approved',
  submitted_by      CHAR(12)      REFERENCES users(id),
  popularity_score  INT           DEFAULT 0,
  release_date      DATETIME,
  created_at        DATETIME      NOT NULL
);

CREATE TABLE content_ratings (
  content_id  CHAR(12) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id     CHAR(12) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stars       TINYINT  NOT NULL CHECK (stars BETWEEN 1 AND 5),
  PRIMARY KEY (content_id, user_id)
);

CREATE TABLE characters (
  id            CHAR(12)      PRIMARY KEY,
  category_id   CHAR(12)      NOT NULL REFERENCES categories(id),
  name          VARCHAR(120)  NOT NULL,
  bio           TEXT          NOT NULL,
  affiliation   VARCHAR(160),
  image_url     TEXT
);

CREATE TABLE character_tags (
  character_id  CHAR(12)     NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  tag           VARCHAR(40)  NOT NULL,
  PRIMARY KEY (character_id, tag)
);

CREATE TABLE merchandise_items (
  id            CHAR(12)      PRIMARY KEY,
  category_id   CHAR(12)      NOT NULL REFERENCES categories(id),
  name          VARCHAR(160)  NOT NULL,
  image_url     TEXT,
  tag           VARCHAR(30),
  is_upcoming   BOOLEAN       DEFAULT 0,
  release_date  DATETIME,
  description   VARCHAR(300),
  view_count    INT           DEFAULT 0
);

CREATE TABLE events (
  id          CHAR(12)      PRIMARY KEY,
  title       VARCHAR(160)  NOT NULL,
  city        VARCHAR(80)   NOT NULL,
  venue       VARCHAR(160),
  lat         DECIMAL(9,6)  NOT NULL,
  lng         DECIMAL(9,6)  NOT NULL,
  date        DATETIME      NOT NULL,
  type        VARCHAR(30),
  ticket_url  TEXT,
  description VARCHAR(300)
);

CREATE TABLE bookmarks (
  id           CHAR(12)     PRIMARY KEY,
  user_id      CHAR(12)     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type  VARCHAR(10)  NOT NULL,
  target_id    CHAR(12)     NOT NULL,
  note         VARCHAR(240),
  created_at   DATETIME     NOT NULL,
  UNIQUE (user_id, target_type, target_id)
);

CREATE TABLE feedback (
  id          CHAR(12)     PRIMARY KEY,
  user_id     CHAR(12)     REFERENCES users(id),
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(180) NOT NULL,
  type        VARCHAR(15)  NOT NULL,
  message     TEXT         NOT NULL,
  status      VARCHAR(10)  DEFAULT 'new',
  created_at  DATETIME     NOT NULL
);

CREATE TABLE chatbot_faq (
  id        CHAR(12)     PRIMARY KEY,
  question  VARCHAR(200) NOT NULL,
  answer    TEXT         NOT NULL,
  category  VARCHAR(30)
);

CREATE TABLE chatbot_faq_keywords (
  faq_id   CHAR(12)     NOT NULL REFERENCES chatbot_faq(id) ON DELETE CASCADE,
  keyword  VARCHAR(60)  NOT NULL,
  PRIMARY KEY (faq_id, keyword)
);

CREATE TABLE chatbot_logs (
  id          CHAR(12) PRIMARY KEY,
  user_id     CHAR(12) REFERENCES users(id),
  message     TEXT     NOT NULL,
  response    TEXT     NOT NULL,
  created_at  DATETIME NOT NULL
);

