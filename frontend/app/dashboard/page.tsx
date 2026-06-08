'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Task } from '@/types';
import { authService, taskService } from '@/services/api';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ClientOnly from '@/components/ClientOnly';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        authService.getMe(),
        taskService.getTasks('all')
      ]);
      setUser(userRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         t.description?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'created_by_me') return t.created_by === user?.id;
    if (filter === 'assigned_to_me') return t.assigned_to === user?.id;
    return true;
  });

  if (loading) {
    return (
      <ClientOnly>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12" suppressHydrationWarning>
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" suppressHydrationWarning>
          <div suppressHydrationWarning>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => { setEditingTask(undefined); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm self-start md:self-center"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
        </div>

        {user && <DashboardStats tasks={tasks} userId={user.id} />}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8" suppressHydrationWarning>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6" suppressHydrationWarning>
            <div className="relative flex-1 max-w-md" suppressHydrationWarning>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0" suppressHydrationWarning>
              {['all', 'assigned_to_me', 'created_by_me'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.replace(/_/g, ' ').charAt(0).toUpperCase() + f.replace(/_/g, ' ').slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={fetchData}
                onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
                currentUserId={user!.id}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No tasks found.
              </div>
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
