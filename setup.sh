#!/bin/bash

# Exit on error
set -e

echo "Installing Podman and dependencies..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Podman
echo "Installing Podman..."
brew install podman
brew install podman-compose

# Initialize Podman machine if it doesn't exist
if ! podman machine list | grep -q "currently running"; then
    echo "Initializing Podman machine..."
    podman machine init
    podman machine start
fi

# Create necessary directories
mkdir -p backend/migrations
mkdir -p backend/uploads

# Create initial migration file
cat > backend/migrations/init.sql << EOL
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    cover_image VARCHAR(255),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_books table
CREATE TABLE IF NOT EXISTS order_books (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    book_id INT REFERENCES books(id),
    quantity INT,
    price DECIMAL(10,2)
);

-- Insert admin user
INSERT INTO users (name, email, password, is_admin)
VALUES ('Admin', 'admin@example.com', '\$2a\$10\$zXvx5h.C/E8JPd3ZyRQWpOfGHKPvyE0JjIpI.oZBtC7ivMUiuCXNi', true)
ON CONFLICT (email) DO NOTHING;
EOL

# Generate go.sum
cd backend
go mod download
go mod tidy
cd ..

# Build and start containers
podman compose build
podman compose up -d

echo "Setup complete! You can now run 'podman-compose up' to start the application."
echo "The admin user credentials are:"
echo "Email: admin@example.com"
echo "Password: admin123"

echo "🚀 Project is running!"
echo "Backend API: http://localhost:8080"