export interface User {
  id: number;
  google_id: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  creator?: User;
  assignee?: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}
