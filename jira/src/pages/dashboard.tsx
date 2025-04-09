import { useSession } from "next-auth/react";
import { api } from "@/utils/api";

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: projects, isLoading: projectsLoading } = api.project.getAll.useQuery();
  const { data: tasks, isLoading: tasksLoading } = api.task.getByProject.useQuery(
    { projectId: projects?.[0]?.id || "" },
    { enabled: !!projects?.[0]?.id }
  );

  if (!session) return <div className="p-6 max-w-6xl mx-auto text-gray-600">Please sign in.</div>;
  if (projectsLoading || tasksLoading) return <div className="p-6 max-w-6xl mx-auto text-gray-600">Loading...</div>;

  const activeProjects = projects?.filter((p) => p.status === "ACTIVE") || [];
  const upcomingTasks = tasks?.filter((t) => t.deadline && new Date(t.deadline) > new Date()) || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Active Projects</h2>
          <p className="text-2xl font-bold text-gray-800">{activeProjects.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Upcoming Tasks</h2>
          <p className="text-2xl font-bold text-gray-800">{upcomingTasks.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Team Members</h2>
          <p className="text-2xl font-bold text-gray-800">
            {projects?.[0]?.members.length || 0}
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Upcoming Tasks</h2>
        <ul className="space-y-3">
          {upcomingTasks.slice(0, 5).map((task) => (
            <li key={task.id} className="p-4 bg-gray-50 rounded-md">
              <span className="font-medium text-gray-800">{task.title}</span>
              <span className="ml-2 text-sm text-gray-500">
                {task.priority} - {task.status}
              </span>
              <span className="ml-2 text-sm text-gray-400">
                (Due: {new Date(task.deadline!).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Project Timeline */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Project Timeline</h2>
        <div className="space-y-4">
          {activeProjects.map((project) => (
            <div key={project.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
              <p className="text-sm text-gray-600">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Members: {project.members.map((m) => m.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}