-- Create categories table first (since products will reference it)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table with foreign key to categories
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Insert sample categories
INSERT INTO categories (name) VALUES 
('Courses'),
('Books'),
('Tutorials'),
('Workshops');

-- Insert sample products
INSERT INTO products (name, price, stock, category_id) VALUES 
('JavaScript Fundamentals', 49.99, 100, 1),
('React Complete Guide', 79.99, 50, 1),
('Node.js Handbook', 39.99, 75, 2),
('TypeScript Manual', 29.99, 120, 2),
('Vue.js Workshop', 99.99, 25, 4),
('Python Basics', 59.99, 80, 3);