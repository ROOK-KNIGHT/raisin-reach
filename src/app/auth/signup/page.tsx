"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please sign in manually.");
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        router.push("/portal");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/portal" });
  };

  return (
    <main className="min-h-screen bg-brand-bone flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-display font-bold text-brand-plum">
            RAISIN REACH.
          </Link>
          <p className="mt-2 text-brand-charcoal/60 font-mono text-sm uppercase tracking-widest">
            Create Your Account
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white border-2 border-brand-plum p-8 shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
          <h1 className="text-3xl font-display font-bold text-brand-plum mb-6 uppercase text-center">
            Sign Up
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full mb-6 px-6 py-3 bg-white border-2 border-brand-charcoal text-brand-charcoal font-bold uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-plum/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-brand-charcoal/60 font-mono uppercase tracking-widest">
                Or
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Your Company Inc."
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-brand-charcoal/60">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-brand-charcoal/60 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-brand-charcoal/60">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-brand-plum font-bold hover:text-brand-gold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-brand-plum hover:text-brand-gold transition-colors font-mono text-sm uppercase tracking-widest">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
