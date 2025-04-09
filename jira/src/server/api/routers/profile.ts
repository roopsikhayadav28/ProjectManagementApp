import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
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
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.profile.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          bio: input.bio,
          avatarUrl: input.avatarUrl,
          location: input.location,
        },
        create: {
          userId: ctx.session.user.id,
          bio: input.bio,
          avatarUrl: input.avatarUrl,
          location: input.location,
        },
      });
    }),
});