import { Task } from '@/types';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Users, 
  Target,
  ArrowUpRight
} from 'lucide-react';

interface DashboardStatsProps {
  tasks: Task[];
  userId: number;
}

export default function DashboardStats({ tasks, userId }: DashboardStatsProps) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const assignedToMe = tasks.filter(t => Number(t.assigned_to) === Number(userId)).length;

  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { 
      label: 'Overall Tasks', 
      value: total, 
      icon: BarChart3, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: `${total > 0 ? '+100%' : '0%'} total usage`,
      trendValue: total > 0 ? '+100%' : '0%'
    },
    { 
      label: 'Pending', 
      value: pending, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: `${pending} active tasks`,
      trendValue: `${pending}`
    },
    { 
      label: 'Completed', 
      value: completed, 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: `${successRate}% success rate`,
      trendValue: `${successRate}%`
    },
    { 
      label: 'Assigned To Me', 
      value: assignedToMe, 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      trend: `Viewing your tasks`,
      trendValue: `Tasks`
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className={`${stat.bg} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3" />
              {stat.trendValue}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            <p className="text-[11px] text-gray-400 mt-2 font-medium">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
