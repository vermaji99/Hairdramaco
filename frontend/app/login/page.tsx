'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';
import { CheckSquare, Layout, ShieldCheck, Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const response = await authService.loginWithGoogle(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Login failed';
      toast.error(msg);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen flex bg-white">
        {/* Left Side: Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white p-2 rounded-xl">
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight">TaskManager Pro</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Manage your team <br /> with precision.
            </h1>
            <p className="text-blue-100 text-lg max-w-md mb-12">
              The all-in-one platform to track, assign, and complete tasks with real-time notifications.
            </p>

            <div className="space-y-6">
              {[
                { icon: Zap, title: 'Instant Notifications', desc: 'Get notified via Gmail as soon as tasks are assigned.' },
                { icon: Layout, title: 'Clean Dashboard', desc: 'Track your progress with a minimalist and powerful UI.' },
                { icon: ShieldCheck, title: 'Secure Auth', desc: 'Enterprise-grade security with Google OAuth 2.0.' },
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

        {/* Right Side: Login Form */}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500">Please sign in to your account</p>
              </div>

              <div className="flex flex-col gap-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => toast.error('Login Failed')}
                    theme="filled_blue"
                    shape="pill"
                  />
                </div>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400 font-medium tracking-widest">Gmail Access Only</span>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  By signing in, you agree to our Terms of Service and Privacy Policy. 
                  Only @gmail.com domains are authorized for access.
                </p>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
