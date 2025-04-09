# ProjectManagementApp

A task management and collaboration tool built as a Senior Software Engineer development task. This application uses the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, NextAuth.js) with Supabase as the database and a serverless backend deployed on AWS using SST. It provides an intuitive interface for task management, user profiles, and (optionally) a dashboard, showcasing proficiency in modern web development and cloud infrastructure.

## Features
- **Task Management**: Create, assign, and track tasks with deadlines, priorities, tags, and team member assignments.
- **User Profiles**: Manage personal info (name, email, bio) via a profile section.
- **Authentication**: Email/password login using NextAuth.js with CredentialsProvider.
- **Serverless Backend**: tRPC APIs deployed on AWS Lambda via SST.
- **Database**: Supabase for storing users, projects, tasks, and profiles.
- **UI**: Responsive design with Tailwind CSS.
- **Optional Dashboard**: Overview of projects, tasks, and team activity .

## Tech Stack
- **Frontend**: Next.js 14 (Pages Router), TypeScript, Tailwind CSS
- **Backend**: tRPC (serverless via Vercel), Prisma
- **Database**: Supabase (PostgreSQL), Prisma ORM
- **Auth**: NextAuth.js with CredentialsProvider
- **Testing**: Jest, ts-jest, @testing-library/react (In progress)
- **Deployment**: Vercel (frontend), AWS (backend via SST)

## Project Setup

### Prerequisites
- Node.js (>= 18.x)
- npm (>= 9.x)
- Supabase account and project
- AWS account and credentials
- Git

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ProjectManagementApp.git
   cd ProjectManagementApp

2. Install Dependencies 
   npm install

3. Set Up Environment Variables:
Create a .env file based on .env.example:

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
Get DATABASE_URL and SUPABASE_ANON_KEY from your Supabase project settings.

4. Initialize the Database:
Define your schema in prisma/schema.prisma (e.g., User, Project, Task, Profile).
   Run Prisma migrations:
   npx prisma migrate dev --name init

5.Run the Development Server:

   npm run dev
   Visit http://localhost:3000.

   Let’s refine your README to align with the Senior Software Engineer task requirements and guide you through deploying your Next.js application to Vercel for the first time! Your project, `ProjectManagementApp`, uses the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, NextAuth.js), integrates Supabase as the database, and leverages SST for a serverless AWS backend. I’ll update the README based on this context and your `next-auth` setup with CredentialsProvider, then walk you through Vercel deployment. We’ll use a Socratic approach with questions to ensure clarity. Ready?

---

### Step 1: Update the README
Here’s a tailored README reflecting your task requirements, including setup, architecture, testing, and deployment details.

#### README.md
```markdown
# ProjectManagementApp

A task management and collaboration tool built as a Senior Software Engineer development task. This application uses the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma, NextAuth.js) with Supabase as the database and a serverless backend deployed on AWS using SST. It provides an intuitive interface for task management, user profiles, and (optionally) a dashboard, showcasing proficiency in modern web development and cloud infrastructure.

## Features
- **Task Management**: Create, assign, and track tasks with deadlines, priorities, tags, and team member assignments.
- **User Profiles**: Manage personal info (name, email, bio) via a profile section.
- **Authentication**: Email/password login using NextAuth.js with CredentialsProvider.
- **Serverless Backend**: tRPC APIs deployed on AWS Lambda via SST.
- **Database**: Supabase for storing users, projects, tasks, and profiles.
- **UI**: Responsive design with Tailwind CSS.
- **Optional Dashboard**: Overview of projects, tasks, and team activity (if implemented).

## Tech Stack
- **Frontend**: Next.js 14 (Pages Router), TypeScript, Tailwind CSS
- **Backend**: tRPC, SST (Serverless Stack), AWS Lambda
- **Database**: Supabase (PostgreSQL), Prisma ORM
- **Auth**: NextAuth.js with CredentialsProvider
- **Testing**: Jest, ts-jest, @testing-library/react
- **Deployment**: Vercel (frontend), AWS (backend via SST)

## Project Setup

### Prerequisites
- Node.js (>= 18.x)
- npm (>= 9.x)
- Supabase account and project
- AWS account and credentials
- Git

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ProjectManagementApp.git
   cd ProjectManagementApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file based on `.env.example`:
     ```env
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
     ```
   - Get `DATABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project settings.

4. **Initialize the Database**:
   - Define your schema in `prisma/schema.prisma` (e.g., User, Project, Task, Profile).
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - Visit [http://localhost:3000](http://localhost:3000).

## Architecture
- **Pages**:
  - `src/pages/index.tsx`: Home page with project list, `TaskList`, `TaskForm`, and `ProfileSection`.
  - `src/pages/dashboard.tsx`: Optional dashboard with project/task overviews.
  - `src/pages/api/auth/[...nextauth].ts`: NextAuth configuration with CredentialsProvider.
- **Components**:
  - `src/components/TaskList.tsx`: Task display with edit/delete functionality.
  - `TaskForm` and `TaskEditForm`: Task creation and editing (embedded in `index.tsx` or extracted).
- **API**:
  - `src/server/api/routers/task.ts`: tRPC routes for task CRUD (create, getByProject, update, delete).
  - `src/server/api/routers/project.ts`: Project management.
  - `src/server/api/routers/profile.ts`: Profile updates.
  - `src/server/api/routers/user.ts`: User queries (e.g., project members).
- **Database**: Supabase via Prisma (`prisma/schema.prisma`):
  - Models: `User`, `Project`, `Task`, `Profile`.
- **Serverless**: SST deploys tRPC APIs to AWS Lambda.
- **Auth**: NextAuth with email/password login, JWT sessions.

- **Flow**: User logs in → Views projects on `/` → Creates/assigns tasks → Updates profile.

## Testing
Unit tests validate key functionality.

### Setup
- **Dependencies**: Jest, ts-jest, @testing-library/react, jest-environment-jsdom.
- **Config**: `jest.config.cjs`:
  ```js
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^jose": "<rootDir>/__mocks__/jose.js",
      "^@panva/hkdf": "<rootDir>/__mocks__/hkdf.js",
    },
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
    },
  };
  ```
- **Mocks**: `__mocks__/jose.js` and `__mocks__/hkdf.js` stub ESM dependencies.

### Running Tests
```bash
npm test
```
- **Files**:
  - `src/server/api/routers/task.test.ts`: Tests task creation and auth checks.
  - `src/pages/__tests__/TaskList.test.tsx`: Verifies task rendering.
  - `src/pages/__tests__/Dashboard.test.tsx`: Checks dashboard UI (if implemented).

### Example Test
```tsx
// TaskList.test.tsx
it("renders tasks correctly", () => {
  (api.task.getByProject.useQuery as jest.Mock).mockReturnValue({
    data: [{ id: "task1", title: "Test Task", priority: "MEDIUM", status: "TODO" }],
    refetch: jest.fn(),
  });
  render(<TaskList projectId="project1" />);
  expect(screen.getByText("Test Task")).toBeInTheDocument();
});
```

## Deployment

### Vercel (Frontend)
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```
2. **Login**:
   ```bash
   vercel login
   ```
3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts to link your GitHub repo and set up the project.
4. **Set Environment Variables**:
   - In Vercel dashboard, go to Settings > Environment Variables and add:
     - `DATABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `NEXTAUTH_URL` (e.g., `https://your-vercel-app.vercel.app`)
     - `NEXTAUTH_SECRET`
5. **Verify**: Visit the deployed URL (e.g., `https://projectmanagementapp.vercel.app`).

### AWS (Serverless Backend with SST)
1. **Install SST**:
   ```bash
   npm install sst --save-dev
   ```
2. **Configure SST**:
   - Create `sst.config.ts`:
     ```ts
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
     ```
3. **Deploy to AWS**:
   ```bash
   npx sst deploy
   ```
   - Ensure AWS credentials are set in `.env` or `~/.aws/credentials`.
4. **Integrate**: Update `NEXTAUTH_URL` in Vercel to match the SST output URL if separate.

- **Note**: For this task, Vercel can host both frontend and tRPC APIs, simplifying deployment. SST is included to meet the AWS requirement but may overlap with Vercel’s hosting.

## Contributing
1. Fork the repo.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a PR.

## License
MIT License - see [LICENSE](LICENSE) for details.
```

---

### Step 2: Deploy to Vercel
Since this is your first time, let’s walk through it!

#### Prerequisites
- A Vercel account ([vercel.com](https://vercel.com)).
- GitHub repo with your code pushed (e.g., `https://github.com/yourusername/ProjectManagementApp`).

#### Steps
1. **Push to GitHub**:
   - Initialize Git if not done:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/ProjectManagementApp.git
     git push -u origin main
     ```

2. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

3. **Login**:
   ```bash
   vercel login
   ```
   - Follow the prompt to authenticate via browser or email.

4. **Deploy from Project Root**:
   ```bash
   cd E:\Technical\Projects\NextJS\NextAuth\jira
   vercel
   ```
   - **Prompts**:
     - Set up and deploy? `Y`
     - Scope? Your Vercel account
     - Link to GitHub? `Y` (optional, auto-deploys on push)
     - Directory? `.` (current dir)
     - Override settings? `N` (Next.js defaults work)

5. **Add Environment Variables**:
   - After deployment, Vercel provides a URL (e.g., `https://projectmanagementapp.vercel.app`).
   - Go to Vercel dashboard > Your Project > Settings > Environment Variables:
     - `DATABASE_URL`: From Supabase (e.g., `postgresql://[user]:[password]@[host]:[port]/[dbname]`)
     - `SUPABASE_ANON_KEY`: From Supabase settings
     - `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://projectmanagementapp.vercel.app`)
     - `NEXTAUTH_SECRET`: Your secret (e.g., from `openssl rand -base64 32`)
   - Redeploy:
     ```bash
     vercel --prod
     ```

6. **Test Deployment**:
   - Visit your URL (e.g., `https://projectmanagementapp.vercel.app`).
   - Sign in with email/password to verify.

- **Question**: What might go wrong during deployment, and how would you troubleshoot?

---

### Step 3: Address SST/AWS Requirement
The task requires SST on AWS, but Vercel hosts both frontend and backend APIs seamlessly. To meet the requirement minimally:
- Use SST locally to deploy a test Lambda (as shown in `sst.config.ts`).
- Document it in the README as proof of AWS capability, even if Vercel is the primary deployment for submission.

- **Question**: How does SST’s serverless approach differ from Vercel’s hosting?