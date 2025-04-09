import { api } from "@/utils/api";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline: string | null;
  tags: string[];
  userId?: string;
  projectId: string;
}


export const TaskList = ({ projectId }: { projectId: string }) => {
  const { data: tasks, refetch } = api.task.getByProject.useQuery({ projectId });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => refetch(),
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);

  return (
    <ul className="space-y-3">
      {tasks?.map((task) => (
        <li
          key={task.id}
          className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
        >
          {editingTask === task.id ? (
            <TaskEditForm
              task={{
                ...task,
                deadline: task.deadline?.toISOString() ?? null,
                userId: task.userId ?? undefined
              }}
              onClose={() => setEditingTask(null)}
            />
          ) : (
            <>
              <div className="flex-1">
                <span className="font-medium text-gray-800">{task.title}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {task.priority} - {task.status}
                </span>
                {task.deadline && (
                  <span className="ml-2 text-sm text-gray-400">
                    (Due: {new Date(task.deadline).toLocaleDateString()})
                  </span>
                )}
                {task.tags?.length > 0 && (
                  <span className="ml-2 text-xs text-gray-600">{task.tags.join(", ")}</span>
                )}
                {task.assignedTo && (
                  <span className="ml-2 text-xs text-blue-600">
                    Assigned: {task.assignedTo.name}
                  </span>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingTask(task.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask.mutate({ id: task.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

function TaskEditForm({ task, onClose }: Readonly<{ task: Task; onClose: () => void }>) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
  );
  const [tags, setTags] = useState<string>(task.tags?.join(", ") ?? "");
  const [userId, setUserId] = useState<string | undefined>(task.userId);
  const { data: members } = api.user.getProjectMembers.useQuery({ projectId: task.projectId });
  const utils = api.useUtils();
  const updateTask = api.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.getByProject.invalidate({ projectId: task.projectId });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask.mutate({
      id: task.id,
      title,
      priority,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags: tags.split(",").map((tag) => tag.trim()),
      userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-1">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
        className="w-full p-2 border rounded-md">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")}
        className="w-full p-2 border rounded-md">
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded-md"
      />
      <select
        value={userId ?? ""}
        onChange={(e) => setUserId(e.target.value || undefined)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Unassigned</option>
        {members?.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <div className="space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};