USE ExpenseTracker;

CREATE TABLE currency (
    currency_id INTEGER PRIMARY KEY,
    currency_name VARCHAR(50) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    b_curr_id INTEGER,
    profile_url VARCHAR(200),
    password VARCHAR(200) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (b_curr_id) REFERENCES currency(currency_id)
);

CREATE TABLE expenses (
    exp_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    date DATE NOT NULL,
    amount INTEGER NOT NULL,
    expense VARCHAR(200) NOT NULL,
    curr_id INTEGER NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (curr_id) REFERENCES currency(currency_id)
);

INSERT INTO currency (currency_id, currency_code, currency_name, isActive) VALUES 
(1, 'INR', 'Indian Rupee', TRUE),
(2, 'USD', 'United States Dollar', TRUE),
(3, 'EUR', 'Euro', TRUE),
(4, 'GBP', 'British Pound', TRUE);

INSERT INTO users (user_id, username, email, password, b_curr_id, profile_url, isActive) VALUES
(1, 'alice', 'alice@example.com', 'password123', 1, 'http://example.com/alice', TRUE),
(2, 'bob', 'bob@example.com', 'password123', 2, 'http://example.com/bob', TRUE),
(3, 'charlie', 'charlie@example.com', 'password123', 3, 'http://example.com/charlie', TRUE),
(4, 'david', 'david@example.com', 'password123', 4, 'http://example.com/david', TRUE);

INSERT INTO expenses (date, amount, expense, curr_id, isActive) VALUES
( '2024-07-05', 50, 'Groceries', 1, TRUE),
( '2024-07-05', 30, 'Transport', 1, TRUE);

-- *****************************************************************************
-- *****************************************************************************
-- *****************************************************************************
-- *****************************************************************************
