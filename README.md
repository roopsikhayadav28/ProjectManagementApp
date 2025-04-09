# ProjectManagementApp

A task management and collaboration tool built as a Senior Software Engineer development task. This application uses the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, NextAuth.js) with Supabase as the database and a serverless backend deployed on AWS using Vercel. It provides an intuitive interface for task management, user profiles, and (optionally) a dashboard, showcasing proficiency in modern web development and cloud infrastructure.

## Features
- Task Management: Create, assign, and track tasks with deadlines, priorities, tags, and team member assignments.
- User Profiles: Manage personal info (name, email, bio) via a profile section.
- Authentication: Email/password login using NextAuth.js with CredentialsProvider.
- Serverless Backend: tRPC APIs deployed on AWS Lambda via Vercel.
- Database: Supabase for storing users, projects, tasks, and profiles.
- UI: Responsive design with Tailwind CSS.
- Optional Dashboard: Overview of projects, tasks, and team activity (if implemented).

## Tech Stack
- Frontend: Next.js 14 (Pages Router), TypeScript, Tailwind CSS
- Backend: tRPC, SST (Serverless Stack), AWS Lambda
- Database: Supabase (PostgreSQL), Prisma ORM
- Auth: NextAuth.js with CredentialsProvider
- Testing: Jest, ts-jest, @testing-library/react
- Deployment: Vercel (frontend), AWS (backend via Vercel)
  Note: Via SST support is not stable on Windows so deployed using Vercel

## Project Setup

### Prerequisites
- Node.js (>= 18.x)
- npm (>= 9.x)
- Supabase account and project
- AWS account and credentials
- Versel account and credentials
- Git

### Installation
1. Clone the Repository:
   git clone (https://github.com/roopsikhayadav28/ProjectManagementApp.git)
   cd jira

2. Install Dependencies:
   npm install

3. *et Up Environment Variables:
   - Create a `.env` file based on `.env.example`:

     # Supabase
     DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[dbname]"
     SUPABASE_ANON_KEY="your-supabase-anon-key"

     # NextAuth
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your-secret-here" # Generate with `openssl rand -base64 32`
     
     # AWS (for SST)
     AWS_ACCESS_KEY_ID="your-aws-access-key"
     AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
     AWS_REGION="us-east-1"
   
   - Get `DATABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project settings.

4. Initialize the Database:
   - Defined schema in `prisma/schema.prisma` (e.g., User, Project, Task, Profile).
    Seed Database File: utils/seed.ts

5. Run the Development Server:
   npm run dev
   - Visit [http://localhost:3000](http://localhost:3000).

## Architecture
- Pages:
  - `src/pages/index.tsx`: Home page with project list, `TaskList`, `TaskForm`, and `ProfileSection`.
  - `src/pages/dashboard.tsx`: Optional dashboard with project/task overviews.
  - `src/pages/api/auth/[...nextauth].ts`: NextAuth configuration with CredentialsProvider.
- **Components**:
  - `src/components/TaskList.tsx`: Task display with edit/delete functionality.
   - `TaskForm` and `TaskEditForm`: Task creation and editing 
- API:
  - `src/server/api/routers/task.ts`: tRPC routes for task CRUD (create, getByProject, update, delete).
  - `src/server/api/routers/project.ts`: Project management.
  - `src/server/api/routers/profile.ts`: Profile updates.
  - `src/server/api/routers/user.ts`: User queries (e.g., project members).
- Database: Supabase via Prisma (`prisma/schema.prisma`):
  - Models: `User`, `Project`, `Task`, `Profile`.
- Auth: NextAuth with email/password login, JWT sessions.

- Flow: User logs in → Views projects on `/` → Creates/assigns tasks → Updates profile.

## Testing
Unit tests validate key functionality.

### Running Tests
npm test
- Files:
  - `src/server/api/routers/task.test.ts`: Tests task creation and auth checks.
  - `src/pages/__tests__/TaskList.test.tsx`: Verifies task rendering.

### Vercel (Frontend)
1. Install Vercel CLI:
   npm i -g vercel
2. Login:
   vercel login
3. Deploy:
   - Follow prompts to link your GitHub repo and set up the project.
4. Set Environment Variables:
   - In Vercel dashboard, go to Settings > Environment Variables and add:
     - `DATABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `NEXTAUTH_URL` (e.g., `https://your-vercel-app.vercel.app`)
     - `NEXTAUTH_SECRET`
5. Verify: Visit the deployed URL (e.g., `https://projectmanagementapp.vercel.app`).


### AWS (Serverless Backend with SST)
## Note : SST currently supports macOS, Linux, and WSL. Support for Windows is on the roadmap.
1. Install SST:
   npm install sst --save-dev
2. Configure SST:
   - Create `sst.config.ts`:

     import { SSTConfig } from "sst";
     import { NextjsSite } from "sst/constructs";

     export default {
       config(_input) {
         return {
           name: "ProjectManagementApp",
           region: "us-east-1",
         };
       },
       stacks(app) {
         app.stack(function Site({ stack }) {
           const site = new NextjsSite(stack, "site");
           stack.addOutputs({
             SiteUrl: site.url,
           });
         });
       },
     } satisfies SSTConfig;
   
3. Deploy to AWS:
   npx sst deploy
   - Ensure AWS credentials are set in `.env` or `~/.aws/credentials`.


## Contributing
1. Fork the repo.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a PR.

 Project Root:
   cd E:\Technical\Projects\NextJS\NextAuth\jira
  
 Test Deployment:
   - Visit your URL : https://project-management-app-liard.vercel.app/
   - Sign in with email/password to verify.
   
   Login using :
      email : alice@example.com
      password : password123


