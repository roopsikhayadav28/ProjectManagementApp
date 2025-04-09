import { PrismaClient, ProjectStatus, TaskPriority, TaskStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data (optional, comment out if you don’t want to reset)
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("password456", 10);

    const user1 = await prisma.user.create({
      data: {
        email: "alice@example.com",
        name: "Alice Smith",
        password: hashedPassword1,
        preferences: { theme: "dark" },
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: "bob@example.com",
        name: "Bob Johnson",
        password: hashedPassword2,
        preferences: { theme: "light" },
      },
    });

    // Seed Profiles
    const profile1 = await prisma.profile.create({
      data: {
        userId: user1.id,
        bio: "Senior developer with a passion for task management.",
        avatarUrl: "https://example.com/avatars/alice.jpg",
        location: "New York",
      },
    });

    const profile2 = await prisma.profile.create({
      data: {
        userId: user2.id,
        bio: "Project manager focused on team collaboration.",
        avatarUrl: "https://example.com/avatars/bob.jpg",
        location: "London",
      },
    });

    // Update Users with Profile IDs
    await prisma.user.update({
      where: { id: user1.id },
      data: { profileId: profile1.id },
    });

    await prisma.user.update({
      where: { id: user2.id },
      data: { profileId: profile2.id },
    });

    // Seed Projects
    const project1 = await prisma.project.create({
      data: {
        name: "Website Redesign",
        description: "Redesign the company website for better UX.",
        status: ProjectStatus.ACTIVE,
        createdById: user1.id,
        members: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: "Mobile App Development",
        description: "Build a new mobile app for task management.",
        status: ProjectStatus.ACTIVE,
        createdById: user2.id,
        members: {
          connect: [{ id: user2.id }],
        },
      },
    });

    // Seed Tasks
    await prisma.task.createMany({
      data: [
        {
          title: "Design Homepage",
          description: "Create wireframes and mockups for the homepage.",
          priority: TaskPriority.HIGH,
          tags: ["design", "ux"],
          status: TaskStatus.TODO,
          deadline: new Date("2025-04-15"),
          userId: user1.id,
          projectId: project1.id,
          createdById: user1.id,
        },
        {
          title: "Implement Authentication",
          description: "Set up user login with NextAuth.js.",
          priority: TaskPriority.MEDIUM,
          tags: ["backend", "auth"],
          status: TaskStatus.IN_PROGRESS,
          deadline: new Date("2025-04-20"),
          userId: user2.id,
          projectId: project1.id,
          createdById: user1.id,
        },
        {
          title: "Develop Task API",
          description: "Create tRPC endpoints for task CRUD.",
          priority: TaskPriority.LOW,
          tags: ["api", "trpc"],
          status: TaskStatus.TODO,
          deadline: new Date("2025-05-01"),
          userId: user2.id,
          projectId: project2.id,
          createdById: user2.id,
        },
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();