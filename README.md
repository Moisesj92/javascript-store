# JavaScript Store

A full-stack e-commerce application built with React (frontend) and Node.js/Express (backend), using PostgreSQL as the database. The project is containerized with Docker for easy development and deployment.

## 🚀 Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products by categories
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS
- **RESTful API**: Well-structured backend API with Express.js
- **Database**: PostgreSQL with automated migrations
- **Testing**: Comprehensive test suite with Jest
- **TypeScript**: Full type safety across frontend and backend

## 🛠️ Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Custom hooks for state management

### Backend

- Node.js with Express.js
- TypeScript
- PostgreSQL with pg driver
- Jest for testing
- ESLint for code quality

### DevOps

- Docker & Docker Compose
- Multi-stage builds for optimization
- Development containers with hot reload

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher) - for local development only
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd javascript-store
```

### 2. Set Up Environment Variables

Create environment files for both frontend and backend:

**Backend environment file:**

```bash
cp backend/.env.example backend/.env
```

**Frontend environment file:**

```bash
cp frontend/.env.example frontend/.env
```

### 3. Run with Docker Compose

The entire application can be started with a single command:

```bash
docker-compose up
```

This will start:

- **Frontend**: Available at http://localhost:3001
- **Backend API**: Available at http://localhost:3000
- **PostgreSQL Database**: Available at localhost:5432

### 4. Access the Application

- Open your browser and navigate to http://localhost:3001
- The API documentation is available at http://localhost:3000/api

## 🔧 Development

### Running Tests

**Backend tests:**

```bash
docker-compose exec backend npm test
```

**Frontend tests:**

```bash
docker-compose exec frontend npm test
```

## 📁 Project Structure

```
javascript-store/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   └── ...
│   ├── Dockerfile.dev      # Frontend development container
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   └── ...
│   ├── migrations/         # Database migration files
│   ├── Dockerfile.dev      # Backend development container
│   └── package.json
├── shared/                  # Shared TypeScript types
│   └── types/
├── compose.yml             # Docker Compose configuration
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

The backend requires the following environment variables:

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Port for the backend server
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password

### Frontend (.env)

The frontend requires:

- `VITE_API_URL`: Backend API base URL

## 📝 API Documentation

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
