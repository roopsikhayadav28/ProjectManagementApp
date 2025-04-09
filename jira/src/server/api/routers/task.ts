import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: { projectId: input.projectId },
        include: { assignedTo: true, createdBy: true }, // Single assigned user
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        deadline: z.string().nullable(),
        tags: z.array(z.string()),
        userId: z.string().optional(), // Single assigned user
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) { // Check id explicitly
        throw new Error("User not authenticated or missing ID");
      }
      return ctx.prisma.task.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          priority: input.priority,
          status: input.status,
          deadline: input.deadline ? new Date(input.deadline) : null,
          tags: input.tags,
          createdById: ctx.session.user.id,
          userId: input.userId || null,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        deadline: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          priority: input.priority,
          status: input.status,
          deadline: input.deadline ? new Date(input.deadline) : null,
          tags: input.tags,
          userId: input.userId || null,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),
});

export const userRouter = createTRPCRouter({
  getProjectMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: { projects: { some: { id: input.projectId } } },
        select: { id: true, name: true },
      });
    }),
});

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.profile.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    }),
});