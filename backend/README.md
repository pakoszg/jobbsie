# Jobbsie Backend

A modern Express.js backend API for the Jobbsie job finder application, built with TypeScript, PostgreSQL, and Prisma ORM.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with user roles (applicants/employers)
- 👥 **User Management** - Separate profiles for job seekers and employers
- 💼 **Job Management** - CRUD operations for job postings with categorization
- ❤️ **Job Interactions** - Like/discard functionality for applicants
- 📄 **Document Management** - CV and document upload for applicants
- 🏷️ **Categories** - Organized job categories for better discovery
- 🔍 **Search & Filtering** - Advanced job search with multiple filters
- 🛡️ **Security** - Rate limiting, CORS, helmet security headers
- 📊 **Database** - PostgreSQL with Prisma ORM for type-safe queries

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Development**: nodemon, ts-node

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp env.example .env
```

Update the environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/jobbsie?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 4. Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The server will be available at `http://localhost:5000`

## Database Schema

### Core Entities

- **Users** - Authentication and account management
- **Applicants** - Job seeker profiles
- **Employers** - Company profiles
- **Job Postings** - Job listings with details
- **Job Categories** - Organized job classifications
- **Liked Jobs** - Applicant job preferences
- **Discarded Jobs** - Jobs filtered out by applicants
- **Docs** - CV and document storage

### Key Relationships

- Users can be either applicants OR employers (not both)
- Employers can create multiple job postings
- Job postings belong to job categories
- Applicants can like/discard jobs
- Applicants can upload multiple documents

## API Endpoints

### Authentication (`/api/auth`)

```http
POST   /api/auth/register    # Register new user (applicant/employer)
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user profile
```

### Job Management (`/api/jobs`)

```http
GET    /api/jobs             # Get all jobs (with filtering)
GET    /api/jobs/:id         # Get job by ID
POST   /api/jobs             # Create new job posting
PUT    /api/jobs/:id         # Update job posting
DELETE /api/jobs/:id         # Delete job posting
POST   /api/jobs/:id/like    # Like a job
POST   /api/jobs/:id/discard # Discard a job
```

### User Management (`/api/users`)

```http
GET    /api/users/profile/:id           # Get user profile
PUT    /api/users/profile               # Update user profile
GET    /api/users                       # Get all users (admin)
GET    /api/users/applicants/:id/liked-jobs  # Get applicant's liked jobs
GET    /api/users/applicants/:id/docs        # Get applicant's documents
POST   /api/users/applicants/:id/docs        # Upload document
```

### Categories (`/api/categories`)

```http
GET    /api/categories        # Get all job categories
GET    /api/categories/:id    # Get category with jobs
POST   /api/categories        # Create new category
PUT    /api/categories/:id    # Update category
DELETE /api/categories/:id    # Delete category
```

### Health Check

```http
GET    /health               # API health status
```

## API Usage Examples

### Register as Applicant

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "userType": "applicant",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1-555-0123"
  }'
```

### Register as Employer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@example.com",
    "password": "password123",
    "userType": "employer",
    "name": "Tech Company Inc.",
    "address": "123 Business St, San Francisco, CA",
    "category": "Technology"
  }'
```

### Search Jobs

```bash
# Basic search
curl "http://localhost:5000/api/jobs?search=developer&page=1&limit=10"

# Filtered search
curl "http://localhost:5000/api/jobs?category=technology&employer=Tech&expired=false"
```

### Create Job Posting

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Senior React Developer",
    "description": "Looking for an experienced React developer...",
    "jobName": "React Developer",
    "hourlySalaryRange": "$60-90/hour",
    "expiryDate": "2024-12-31T23:59:59.000Z",
    "employerId": "employer-id",
    "jobCategoryId": "category-id"
  }'
```

## Database Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and run a new migration
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database and run seed
npm run db:seed
```

## Sample Data

After running `npm run db:seed`, you'll have:

**Sample Accounts:**

- Employer: `employer@example.com` / `password123`
- Applicant: `applicant@example.com` / `password123`

**Job Categories:**

- Technology, Healthcare, Finance, Education, Marketing, Sales, Customer Service, Administration, Retail, Hospitality

**Sample Jobs:**

- Senior Full Stack Developer
- Frontend React Developer
- Digital Marketing Specialist

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers protection
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: express-validator for request validation

## Error Handling

The API includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)
- Prisma-specific errors (P2025, etc.)

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm test             # Run tests (when implemented)
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Run database migrations: `npm run db:migrate`
4. Build the application: `npm run build`
5. Start the server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
