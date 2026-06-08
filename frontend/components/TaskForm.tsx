'use client';

import { useForm } from 'react-hook-form';
import { Task, User } from '@/types';
import { taskService, userService } from '@/services/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to?.toString() || '',
    } : {
      title: '',
      description: '',
      assigned_to: '',
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        assigned_to: data.assigned_to ? parseInt(data.assigned_to) : null,
      };

      if (task) {
        await taskService.updateTask(task.id, payload);
        toast.success('Task updated');
      } else {
        await taskService.createTask(payload);
        toast.success('Task created');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400"
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Assign To</label>
            <select
              {...register('assigned_to')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
