import { createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";
import { profileRouter } from "./routers/profile";

export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
  project: projectRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;