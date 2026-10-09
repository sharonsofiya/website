# Dynamic Developer Portfolio (Bootstrap 5 & Express REST API)

A full-stack, responsive, and dynamic personal portfolio website engineered with **Bootstrap 5** on the frontend and an **Express.js RESTful API** documented with **Swagger / OpenAPI 3.0** on the backend.

---

## 🌟 Key Features

### 💻 Frontend (Bootstrap 5 — No Tailwind CSS)
- **10 Complete Portfolio Sections**:
  - **Home (Hero)**: Headline, bio summary, live status indicator, metrics counters, and social pills.
  - **About**: Architectural narrative, key competencies, and fast-facts summary.
  - **Skills**: Categorized technical proficiencies (Frontend, Backend, Database, Cloud & DevOps, Tools) with animated Bootstrap progress bars.
  - **Experience**: Responsive Bootstrap timeline of career milestones, responsibilities, and achievements.
  - **Projects**: Category filtering (`All`, `Web`, `Mobile`, `AI`, `Full Stack`), real-time search, pagination, and Bootstrap modal detail view.
  - **Education**: Degree credentials, institutions, GPA, and honors.
  - **Certifications**: Industry badges (AWS, Kubernetes, MongoDB, Meta) with credential verification links.
  - **Achievements**: Hackathon wins, open source awards, and technical publications.
  - **GitHub Telemetry**: Repository stars, forks, language badges, and commit indicators.
  - **Contact**: Interactive submission form with field validation and alerts.
- **Dynamic States Everywhere**:
  - **Loading State**: Bootstrap `spinner-border`.
  - **Empty State**: Friendly illustration and guidance.
  - **Data State**: Clean, responsive grid cards.
  - **Error State**: Dismissible alerts with an interactive **Retry** button.
- **Theme Support**: Dark mode and Light mode with instant toggle and `localStorage` persistence.
- **Admin CMS Panel**: Built-in modal management allowing non-technical or direct browser CRUD operations on projects, skills, experience, and contact inquiries without editing source code.

### ⚙️ Backend (Node.js & Express REST API)
- **Controller / Service / Route Architecture**: Separation of concerns with modular controllers, services, routes, and validation.
- **OpenAPI 3.0 & Swagger UI**: Fully interactive API documentation hosted at `/api-docs` with reusable schemas, parameters, and example responses.
- **Pluggable Database Abstraction**: Abstract repository layer with persistent JSON file storage (`backend/data/db.json`) and memory adapter for unit testing.
- **Security Best Practices**:
  - `helmet` security headers with fine-tuned Content Security Policy (CSP).
  - `cors` configuration for cross-origin protection.
  - `express-rate-limit` DDoS and spam mitigation for API routes and contact form submissions.
  - Centralized error handling and structured JSON error responses.
  - JWT token and API Key admin authentication.

---

## 📁 Project Structure

```
profile/
├── backend/
│   ├── config/
│   │   ├── env.js                # Environment variables & runtime config
│   ├── controllers/              # HTTP request/response controllers
│   │   ├── profileController.js
│   │   ├── aboutController.js
│   │   ├── skillsController.js
│   │   ├── experienceController.js
│   │   ├── projectsController.js
│   │   ├── educationController.js
│   │   ├── certificationsController.js
│   │   ├── achievementsController.js
│   │   ├── socialLinksController.js
│   │   ├── contactController.js
│   │   ├── githubController.js
│   │   └── authController.js
│   ├── services/                 # Business logic layer
│   │   ├── profileService.js
│   │   ├── aboutService.js
│   │   ├── skillsService.js
│   │   ├── experienceService.js
│   │   ├── projectsService.js
│   │   ├── educationService.js
│   │   ├── certificationsService.js
│   │   ├── achievementsService.js
│   │   ├── socialLinksService.js
│   │   ├── contactService.js
│   │   ├── githubService.js
│   │   └── authService.js
│   ├── routes/                   # Express routes & middleware wiring
│   │   ├── index.js              # Master API router (/api/...)
│   │   ├── profileRoutes.js
│   │   ├── aboutRoutes.js
│   │   ├── skillsRoutes.js
│   │   ├── experienceRoutes.js
│   │   ├── projectsRoutes.js
│   │   ├── educationRoutes.js
│   │   ├── certificationsRoutes.js
│   │   ├── achievementsRoutes.js
│   │   ├── socialRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── githubRoutes.js
│   │   └── authRoutes.js
│   ├── models/                   # Database abstraction & entity models
│   │   ├── database.js           # Abstract repository & JSON file adapter
│   │   ├── seedData.js           # Default rich portfolio data
│   │   ├── Profile.js
│   │   ├── About.js
│   │   ├── Skill.js
│   │   ├── Experience.js
│   │   ├── Project.js
│   │   ├── Education.js
│   │   ├── Certification.js
│   │   ├── Achievement.js
│   │   ├── SocialLink.js
│   │   ├── ContactMessage.js
│   │   └── index.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT & x-admin-key verification
│   │   ├── validator.js          # Request payload validation
│   │   ├── rateLimiter.js        # API & Contact rate limits
│   │   └── errorHandler.js       # Centralized error handler & 404
│   ├── swagger/                  # OpenAPI 3.0 definition
│   │   └── swaggerDocs.js
│   ├── data/
│   │   └── db.json               # Auto-generated persistent storage
│   ├── test.js                   # Automated integration test suite
│   └── server.js                 # Server entry point
├── frontend/
│   ├── components/               # Modular component references
│   │   ├── navbar.html
│   │   ├── project-card.html
│   │   └── modals.html
│   ├── pages/
│   │   └── index.html            # Main portfolio single-page application
│   ├── assets/                   # Images and static media
│   ├── css/
│   │   └── styles.css            # Custom CSS enhancements for Bootstrap 5
│   ├── js/
│   │   ├── api.js                # Frontend REST API client
│   │   ├── theme.js              # Dark/Light theme manager
│   │   ├── admin.js              # Admin CMS dialogs & CRUD logic
│   │   └── app.js                # Core UI renderer & state manager
│   └── index.html                # Root entry point
├── .env                          # Local environment variables
├── .env.example                  # Environment configuration template
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, tested on v20.18.0 LTS)
- **npm** (v9.0.0 or higher)

### 2. Install Dependencies
In the root directory, install the required packages:
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (already generated with sensible defaults):
```bash
cp .env.example .env
```

Key environment settings:
```ini
PORT=5000
NODE_ENV=development

# Database mode: 'file' (persisted JSON) or 'memory'
DB_TYPE=file
DB_FILE_PATH=./backend/data/db.json

# Admin CMS Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_KEY=agy-portfolio-admin-supersecret-token
JWT_SECRET=portfolio-secure-jwt-secret-key-change-in-prod-2026
JWT_EXPIRES_IN=24h

# GitHub API Integration
GITHUB_USERNAME=alexvance-dev

# Security & CORS
CORS_ORIGIN=*
```

### 4. Start the Application
Start the unified full-stack server:
```bash
npm start
```
Or in development mode:
```bash
npm run dev
```

The application runs on a single server serving both the backend API and frontend assets:
- **Portfolio Website**: [http://localhost:5000](http://localhost:5000)
- **Interactive Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

---

## 📖 Swagger / OpenAPI Documentation

Navigate to `http://localhost:5000/api-docs` in your browser.

Swagger UI provides interactive documentation for every endpoint:
- **Profile**: `GET /api/profile`, `PUT /api/profile`
- **About**: `GET /api/about`, `PUT /api/about`
- **Skills**: `GET /api/skills`, `POST /api/skills`, `PUT /api/skills/:id`, `DELETE /api/skills/:id`
- **Experience**: `GET /api/experience`, `POST /api/experience`, `PUT /api/experience/:id`, `DELETE /api/experience/:id`
- **Projects**: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- **Education**: `GET /api/education`, `POST /api/education`, `PUT /api/education/:id`, `DELETE /api/education/:id`
- **Certifications**: `GET /api/certifications`, `POST /api/certifications`, `PUT /api/certifications/:id`, `DELETE /api/certifications/:id`
- **Achievements**: `GET /api/achievements`, `POST /api/achievements`, `PUT /api/achievements/:id`, `DELETE /api/achievements/:id`
- **Social Links**: `GET /api/social-links`
- **Contact**: `POST /api/contact`, `GET /api/contact`, `PATCH /api/contact/:id/read`, `DELETE /api/contact/:id`
- **GitHub**: `GET /api/github`
- **Auth**: `POST /api/auth/login`, `GET /api/auth/verify`, `POST /api/auth/reset`

---

## 🛠️ Content Management & Editing Data

You can add, update, and manage portfolio records using two convenient methods:

### Method A: Via the Web Admin Panel (No Coding Required)
1. Open the portfolio at [http://localhost:5000](http://localhost:5000).
2. Click the **Admin Login** button in the top navbar.
3. Sign in with the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. The **Portfolio Content Management (CMS)** modal will open. From here, you can:
   - **Projects Tab**: Create new projects, edit title, image, categories, features, or delete projects.
   - **Skills Tab**: Add new technical skills with category and proficiency percentage slider.
   - **Experience Tab**: Add, edit, or remove career history entries.
   - **Inquiries Tab**: Read visitor contact messages, mark them as read, or delete them.
   - **System Tab**: Reset all database records back to the initial high-quality defaults with one click.
5. Updates immediately reflect on the live website without restarting the server!

### Method B: Via REST API Calls (cURL / Postman / Swagger)

#### 1. Authenticate to obtain a JWT token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```
Response:
```json
{
  "success": true,
  "message": "Admin authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Create a new project:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "title": "QuantumPulse AI",
    "description": "Distributed quantum algorithm simulation suite with real-time visualization.",
    "category": "AI",
    "technologies": ["Node.js", "Python", "Bootstrap 5", "WebSockets"],
    "githubUrl": "https://github.com/alexvance-dev/quantum-pulse",
    "liveUrl": "https://quantumpulse.example.com",
    "featured": true,
    "features": ["Quantum circuit compiler", "Browser-based Bloch sphere simulator"]
  }'
```

#### 3. Update an existing skill:
```bash
curl -X PUT http://localhost:5000/api/skills/skill-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "JavaScript (ES6+) & TypeScript",
    "category": "Frontend",
    "proficiency": 98
  }'
```

#### 4. Delete a project:
```bash
curl -X DELETE http://localhost:5000/api/projects/proj-8 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

*(Alternatively, you can provide the header `x-admin-key: agy-portfolio-admin-supersecret-token` configured in your `.env` file instead of Bearer token.)*

---

## 🧪 Testing the API

Run the automated integration test suite covering all REST endpoints, validation errors, error codes, and OpenAPI specifications:
```bash
npm test
```

### Test Suite Output:
```
🧪 Starting API Integration Tests...
  ✅ PASS: GET /api/health returns healthy
  ✅ PASS: GET /api/profile returns developer details
  ✅ PASS: GET /api/about returns paragraphs
  ✅ PASS: GET /api/skills returns 18 skills
  ✅ PASS: GET /api/experience returns 3 roles
  ✅ PASS: GET /api/projects returns 8 projects
  ✅ PASS: GET /api/projects?category=Web filters correctly
  ✅ PASS: GET /api/projects?search=telemetry searches correctly
  ✅ PASS: GET /api/projects/:id returns single project
  ✅ PASS: GET /api/education returns education entries
  ✅ PASS: GET /api/certifications returns certifications
  ✅ PASS: GET /api/achievements returns achievements
  ✅ PASS: GET /api/social-links returns links
  ✅ PASS: GET /api/github returns GitHub stats
  ✅ PASS: POST /api/contact validates input fields correctly
  ✅ PASS: POST /api/contact succeeds with valid payload
  ✅ PASS: POST /api/auth/login authenticates admin and provides JWT
  ✅ PASS: GET /api/auth/verify verifies JWT token
  ✅ PASS: GET /api-docs.json serves valid OpenAPI 3.0 spec

📊 Tests complete! Passed: 19, Failed: 0
```

---

## 🔒 Security Summary
- **No secrets in frontend**: All credentials, tokens, and keys are validated exclusively on the Express backend.
- **Rate Limiting**: Contact endpoint is strictly rate limited (10 requests per 15 minutes) to protect against spam; global API routes are limited to 300 requests per 15 minutes.
- **Input Sanitization**: Email format regex, string trimming, and required field enforcement are executed on both client and server.
- **CORS & Helmet**: Cross-Origin Resource Sharing and Content Security Policy protections against XSS, clickjacking, and packet sniffing.

---

## 📄 License
This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
