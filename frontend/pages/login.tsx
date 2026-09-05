import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    router.push('/onboarding');
  };

  return (
    <>
      <Head>
        <title>Sign In — Chowkidar</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-surface-secondary)]">
        <Card className="w-full max-w-md p-8 flex flex-col gap-6">
          <div className="flex flex-col text-center gap-1">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Chowkidar</h1>
            <p className="text-sm text-muted">Notice what matters. Calm stock watchlist monitoring.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted uppercase">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-primary outline-none focus:border-positive"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted uppercase">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 px-3 bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-primary outline-none focus:border-positive"
              />
            </div>

            <Button variant="primary" size="lg" type="submit" className="mt-2">
              Sign In to Chowkidar
            </Button>
          </form>

          <div className="text-center text-xs text-muted border-t border-[var(--color-border)] pt-4">
            Demo account mode active · Click Sign In to enter
          </div>
        </Card>
      </div>
    </>
  );
}
