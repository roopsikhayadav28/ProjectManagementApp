import { render, screen } from "@testing-library/react";
import Dashboard from "../dashboard"; // Default export
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));
jest.mock("@/utils/api", () => ({
  api: {
    project: { getAll: { useQuery: jest.fn() } },
    task: { getByProject: { useQuery: jest.fn() } },
  },
}));

describe("Dashboard", () => {
  it("renders overview with active projects", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "user1", name: "User" } },
      status: "authenticated",
    });
    (api.project.getAll.useQuery as jest.Mock).mockReturnValue({
      data: [{ id: "project1", name: "Project 1", status: "ACTIVE", members: [{ id: "user1", name: "User" }] }],
      isLoading: false,
    });
    (api.task.getByProject.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
  });
});