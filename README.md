# Book Store with FastAPI, Next.js, and MCP

A modern book store application using FastAPI for the backend, Next.js for the frontend, and Model Context Protocol (MCP) with Ollama for AI-powered book descriptions.

## Features

- FastAPI backend with async SQLAlchemy and PostgreSQL
- Next.js frontend with TypeScript and Tailwind CSS
- MCP integration using Ollama and CodeLlama for AI-generated book descriptions
- JWT-based authentication
- Role-based access control (Admin/User)
- Docker/Podman containerization

## Getting Started

### Prerequisites

- Docker or Podman
- Node.js 18+ (for local development)
- Python 3.12+ (for local development)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-store.git
   cd book-store
   ```

2. Create environment files:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   ```

The services will start in the following order:
1. PostgreSQL database (port 5432)
2. Database migrations
3. MCP service with Ollama (port 11434)
4. FastAPI backend (port 8080)
5. Next.js frontend (port 3000)

### Default Admin Account

After starting the services, you can log in with the default admin account:
- Email: admin@example.com
- Password: admin123

### API Documentation

- OpenAPI documentation: http://localhost:8080/docs
- ReDoc documentation: http://localhost:8080/redoc

## Development

### Backend Development

```bash
cd backend
poetry install
poetry shell
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: PostgreSQL connection URL
- `MCP_URL`: Ollama service URL
- See `.env.example` for all options

#### Frontend (.env)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_URL`: NextAuth.js URL
- `NEXTAUTH_SECRET`: NextAuth.js secret

## Architecture

### Backend (FastAPI)
- Async SQLAlchemy with PostgreSQL
- JWT authentication
- Role-based access control
- Alembic migrations
- Pydantic data validation

### Frontend (Next.js)
- TypeScript
- NextAuth.js for authentication
- Tailwind CSS for styling
- Redux for state management

### MCP Service (Ollama)
- CodeLlama 13B model for AI-powered descriptions
- RESTful API integration
- Automatic model loading

## Container Dependencies

Services start in the following order with proper health checks:
1. `db` - PostgreSQL database
2. `migrations` - Alembic database migrations
3. `mcp` - Ollama MCP service
4. `backend` - FastAPI application
5. `frontend` - Next.js application

## License

This project is licensed under the MIT License - see the LICENSE file for details.