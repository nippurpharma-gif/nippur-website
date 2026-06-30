'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';

const ADMIN_PASSWORD = 'nippur2024';

export function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setViewMode, locale } = useAppStore();

  const isAr = locale === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setViewMode('dashboard');
    } else {
      setError(isAr ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2 pt-8">
            <motion.img
              src="/images/logo-nippur.png"
              alt="NIPPUR Pharma"
              className="h-16 w-auto brightness-0 invert mx-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isAr ? 'لوحة التحكم' : 'Admin Dashboard'}
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {isAr ? 'أدخل كلمة المرور للوصول' : 'Enter password to access'}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Label htmlFor="password" className="text-white/70 text-sm mb-2 block">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500 focus:ring-brand-500/20 h-12"
                    autoFocus
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full mt-6 h-12 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isAr ? 'جاري التحقق...' : 'Verifying...'}</span>
                    </div>
                  ) : (
                    isAr ? 'تسجيل الدخول' : 'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-white/30 text-xs mt-6"
        >
          NIPPUR Pharma &mdash; {isAr ? 'نظام إدارة المحتوى' : 'Content Management System'}
        </motion.p>
      </motion.div>
    </div>
  );
}
