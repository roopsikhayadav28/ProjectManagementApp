import { createInnerTRPCContext } from "../trpc";
import { taskRouter } from "./task";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

describe("Task Router", () => {
  const prismaMock = mockDeep<PrismaClient>();
  const validCtx = createInnerTRPCContext({
    session: { user: { id: "user1", email: "user@example.com", name: "User" }, expires: "1" },
    prisma: prismaMock,
  });
  const invalidCtx = createInnerTRPCContext({
    session: null,
    prisma: prismaMock,
  });
  const caller = taskRouter.createCaller(validCtx);
  const invalidCaller = taskRouter.createCaller(invalidCtx);

  it("creates a task successfully with valid session", async () => {
    const input = {
      projectId: "project1",
      title: "Test Task",
      priority: "MEDIUM",
      status: "TODO",
      deadline: "2025-04-15",
      tags: ["test"],
      userId: "user2",
    };
    const expectedTask = {
      id: "task1",
      ...input,
      createdById: "user1",
      deadline: new Date("2025-04-15"),
    };
    prismaMock.task.create.mockResolvedValue(expectedTask);
    const result = await caller.create(input);
    expect(result).toMatchObject({
      projectId: "project1",
      title: "Test Task",
      priority: "MEDIUM",
      status: "TODO",
      tags: ["test"],
      userId: "user2",
      createdById: "user1",
    });
  });

  it("throws error when user is not authenticated", async () => {
    const input = {
      projectId: "project1",
      title: "Test Task",
      priority: "MEDIUM",
      status: "TODO",
      deadline: null,
      tags: [],
      userId: null,
    };
    await expect(invalidCaller.create(input)).rejects.toThrow(
      "User not authenticated or missing ID"
    );
  });
});