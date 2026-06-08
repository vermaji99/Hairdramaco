'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';
import { CheckSquare, Layout, ShieldCheck, Zap, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (!formData.email.endsWith('@gmail.com')) {
      return toast.error('Only Gmail accounts are allowed');
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen flex bg-white">
        {/* Left Side: Branding & Features (Same as Login) */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white p-2 rounded-xl">
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight">TaskManager Pro</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Start managing <br /> with precision.
            </h1>
            <p className="text-blue-100 text-lg max-w-md mb-12">
              Join thousands of teams who organize their work and achieve more together.
            </p>

            <div className="space-y-6">
              {[
                { icon: Zap, title: 'Instant Notifications', desc: 'Get notified via Gmail as soon as tasks are assigned.' },
                { icon: Layout, title: 'Clean Dashboard', desc: 'Track your progress with a minimalist and powerful UI.' },
                { icon: ShieldCheck, title: 'Secure Auth', desc: 'Enterprise-grade security for your data.' },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-blue-500/30 p-2 rounded-lg h-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-blue-200 text-sm">
            © 2024 TaskManager Pro. All rights reserved.
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md w-full">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl mb-4">
                <CheckSquare className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">TaskManager Pro</h1>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-500">Sign up with your Gmail account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="you@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Must be a @gmail.com account</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
