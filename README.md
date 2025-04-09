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
- **Backend**: tRPC, SST (Serverless Stack), AWS Lambda
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
