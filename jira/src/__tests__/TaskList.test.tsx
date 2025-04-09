import { render, screen } from '@testing-library/react';
import { TaskList } from '@/components/TaskList';
import { api } from '@/utils/api';

// Mock the API
jest.mock('@/utils/api', () => ({
  api: {
    task: {
      getByProject: {
        useQuery: jest.fn(),
      },
      delete: {
        useMutation: jest.fn(),
      },
    },
  },
}));

describe('TaskList', () => {
  it('renders tasks correctly', () => {
    const mockTasks = [{
      id: '1',
      title: 'Test Task',
      priority: 'MEDIUM',
      status: 'TODO',
      assignedTo: { name: 'Alice' },
      deadline: null,
      tags: [],
    }];

    (api.task.getByProject.useQuery as jest.Mock).mockReturnValue({
      data: mockTasks,
      refetch: jest.fn(),
    });

    render(<TaskList projectId="project1" />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM - TODO')).toBeInTheDocument();
    expect(screen.getByText('Assigned: Alice')).toBeInTheDocument();
  });
});