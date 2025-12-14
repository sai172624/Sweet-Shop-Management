Sweet Shop Management System

A full-stack Sweet Shop Management System built using MERN stack principles.
The application supports role-based access (Admin/User), inventory management,
ordering, authentication, and a modern frontend UI.

--------------------------------------------------

FEATURES

Authentication & Authorization
- User registration & login using JWT
- Role-based access control (Admin / User)
- Secure protected APIs

Sweet Management
- Public viewing of sweets (no login required)
- Search and filter sweets
- Admin can add, edit, and delete sweets
- Stock availability handling

Orders & Inventory
- Add to cart and checkout (users)
- Purchase history
- Inventory logs
- Admin dashboard with statistics

Deployment
- Backend deployed on Render
- Frontend deployed on Vercel
- Production-safe CORS configuration

--------------------------------------------------

TECH STACK

Frontend
- React (Vite)
- JavaScript
- Responsive UI
- Deployed on Vercel

Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Deployed on Render

--------------------------------------------------

SETUP INSTRUCTIONS (LOCAL)

Backend
1. Navigate to backend folder
2. Run: npm install
3. Run: npm start

Frontend
1. Navigate to frontend folder
2. Run: npm install
3. Run: npm run dev

--------------------------------------------------

ENVIRONMENT VARIABLES

Backend (.env)

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000

--------------------------------------------------

MY AI USAGE

AI Tools Used
- ChatGPT (OpenAI)

How I Used AI

I used ChatGPT as a development assistant throughout this project for:

Backend Development
- Refactoring Express server into modular components
- Structuring authentication and authorization logic

API Design
- Planning RESTful API endpoints
- Handling error responses and middleware flow
- Improving JWT handling and security practices

Frontend Development
- Structuring React components
- Debugging state management and conditional rendering
- Improving navigation flow and UI behavior

Debugging & Deployment
- Fixing CORS issues
- Configuring backend deployment on Render
- Resolving frontend build and deployment issues on Vercel

Best Practices
- Clean code principles
- Scalability and maintainability improvements

--------------------------------------------------

REFLECTION ON AI IMPACT

Using AI significantly improved my development workflow.

- Reduced development time
- Helped resolve blockers quickly
- Improved debugging efficiency
- Allowed focus on system design and logic

AI was used as a support tool.
All final decisions and implementations were done manually.

--------------------------------------------------

FUTURE IMPROVEMENTS

- Test-Driven Development (Jest + Supertest)
- Improved API validation
- Dockerization
- CI/CD pipelines
- Enhanced admin analytics

--------------------------------------------------

AUTHOR

Sai Laxman
