'use client';

import { Task } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar, 
  User, 
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { taskService } from '@/services/api';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onEdit: (task: Task) => void;
  currentUserId: number;
}

export default function TaskCard({ task, onUpdate, onEdit, currentUserId }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  const handleComplete = async () => {
    try {
      await taskService.completeTask(task.id);
      toast.success('Task marked as completed');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(task.id);
      toast.success('Task deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className={`group relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 ${isCompleted ? 'bg-gray-50/50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
              isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {task.status}
            </span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium">
              <Calendar className="h-3 w-3" />
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>
          <h3 className={`text-lg font-bold leading-snug transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <p className={`text-sm mt-2 leading-relaxed ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-50 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
              <User className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Assignee:</span>
          </div>
          <span className="text-xs font-semibold text-gray-700">
            {task.assignee?.name || 'Unassigned'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center">
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </div>
            <span className="text-xs text-gray-500">Creator:</span>
          </div>
          <span className="text-xs font-semibold text-gray-700">{task.creator?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isCompleted && (
          <button
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete
          </button>
        )}
        
        {task.created_by === currentUserId && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Edit Task"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
