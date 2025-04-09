import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import { TaskList } from "@/components/TaskList"; // Updated import
import { Session } from "inspector/promises";

export default function Home() {
  const { data: session } = useSession();
  const { data: projects, isLoading } = api.project.getAll.useQuery();

  if (!session) return <div className="p-6 max-w-4xl mx-auto text-gray-600">Please sign in.</div>;
  if (isLoading) return <div className="p-6 max-w-4xl mx-auto text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome, {session.user.name}
      </h1>
      <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">
        Go to Dashboard
      </Link>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Projects</h2>
      {projects?.map((project) => (
        <div key={project.id} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            {project.name} - <span className="text-green-600">{project.status}</span>
          </h3>
          <TaskList projectId={project.id} />
          <TaskForm projectId={project.id} />
        </div>
      ))}
      <ProfileSection />
    </div>
  );
}

// function TaskList({ projectId }: { projectId: string }) {
//   const { data: tasks, refetch } = api.task.getByProject.useQuery({ projectId });
//   const deleteTask = api.task.delete.useMutation({
//     onSuccess: () => refetch(),
//   });
//   const [editingTask, setEditingTask] = useState<string | null>(null);

//   return (
//     <ul className="space-y-3">
//       {tasks?.map((task) => (
//         <li
//           key={task.id}
//           className="p-4 bg-gray-50 rounded-md flex justify-between items-center"
//         >
//           {editingTask === task.id ? (
//             <TaskEditForm task={task} onClose={() => setEditingTask(null)} />
//           ) : (
//             <>
//               <div className="flex-1">
//                 <span className="font-medium text-gray-800">{task.title}</span>
//                 <span className="ml-2 text-sm text-gray-500">
//                   {task.priority} - {task.status}
//                 </span>
//                 {task.deadline && (
//                   <span className="ml-2 text-sm text-gray-400">
//                     (Due: {new Date(task.deadline).toLocaleDateString()})
//                   </span>
//                 )}
//                 {task.tags?.length > 0 && (
//                   <span className="ml-2 text-xs text-gray-600">{task.tags.join(", ")}</span>
//                 )}
//                 {task.assignedTo && (
//                   <span className="ml-2 text-xs text-blue-600">
//                     Assigned: {task.assignedTo.name}
//                   </span>
//                 )}
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => setEditingTask(task.id)}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deleteTask.mutate({ id: task.id })}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </>
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// }

function TaskForm({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: members } = api.user.getProjectMembers.useQuery({ projectId });
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      utils.task.getByProject.invalidate({ projectId });
      setTitle("");
      setPriority("MEDIUM");
      setStatus("TODO");
      setDeadline("");
      setTags("");
      setUserId(undefined);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!session) return
    createTask.mutate({
      projectId,
      title,
      priority,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags: tags.split(",").map((tag) => tag.trim()),
      userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
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
        value={userId || ""}
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
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}

// function TaskEditForm({ task, onClose }: { task: any; onClose: () => void }) {
//   const [title, setTitle] = useState(task.title);
//   const [priority, setPriority] = useState(task.priority);
//   const [status, setStatus] = useState(task.status);
//   const [deadline, setDeadline] = useState(
//     task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
//   );
//   const [tags, setTags] = useState(task.tags.join(", "));
//   const [userId, setUserId] = useState<string | undefined>(task.userId);
//   const { data: members } = api.user.getProjectMembers.useQuery({ projectId: task.projectId });
//   const utils = api.useUtils();
//   const updateTask = api.task.update.useMutation({
//     onSuccess: () => {
//       utils.task.getByProject.invalidate({ projectId: task.projectId });
//       onClose();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateTask.mutate({
//       id: task.id,
//       title,
//       priority,
//       status,
//       deadline: deadline ? new Date(deadline).toISOString() : null,
//       tags: tags.split(",").map((tag) => tag.trim()),
//       userId,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 flex-1">
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <select
//         value={priority}
//         onChange={(e) => setPriority(e.target.value)}
//         className="w-full p-2 border rounded-md"
//       >
//         <option value="LOW">Low</option>
//         <option value="MEDIUM">Medium</option>
//         <option value="HIGH">High</option>
//       </select>
//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//         className="w-full p-2 border rounded-md"
//       >
//         <option value="TODO">To Do</option>
//         <option value="IN_PROGRESS">In Progress</option>
//         <option value="DONE">Done</option>
//       </select>
//       <input
//         type="date"
//         value={deadline}
//         onChange={(e) => setDeadline(e.target.value)}
//         className="w-full p-2 border rounded-md"
//       />
//       <input
//         type="text"
//         value={tags}
//         onChange={(e) => setTags(e.target.value)}
//         placeholder="Tags (comma-separated)"
//         className="w-full p-2 border rounded-md"
//       />
//       <select
//         value={userId || ""}
//         onChange={(e) => setUserId(e.target.value || undefined)}
//         className="w-full p-2 border rounded-md"
//       >
//         <option value="">Unassigned</option>
//         {members?.map((member) => (
//           <option key={member.id} value={member.id}>
//             {member.name}
//           </option>
//         ))}
//       </select>
//       <div className="space-x-2">
//         <button
//           type="submit"
//           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Save
//         </button>
//         <button
//           type="button"
//           onClick={onClose}
//           className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

function ProfileSection() {
  const { data: session } = useSession();
  const { data: profile, refetch } = api.profile.get.useQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");
  const [location, setLocation] = useState(profile?.location || "");
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ bio, avatarUrl, location });
    // Note: Name updates would require a separate User update if needed
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // Name is in User, not Profile
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Avatar URL"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-gray-600">Name: {session?.user.name}</p>
          <p className="text-gray-600">Email: {session?.user.email}</p>
          <p className="text-gray-600">Bio: {profile?.bio || "Not set"}</p>
          {profile?.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full mt-2"
            />
          )}
          <p className="text-gray-600">Location: {profile?.location || "Not set"}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}