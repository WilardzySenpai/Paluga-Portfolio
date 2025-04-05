// src/app/admin/login/page.tsx

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Lock, User } from 'lucide-react'

// Login form schema
const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Reset potential previous errors
    form.clearErrors();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
         // Use specific error from API if available, otherwise generic
        throw new Error(data.error || 'Invalid username or password');
      }

      // Successfully logged in
      toast.success("Login successful!");

      // Redirect to dashboard
      // Use replace to prevent login page in history after successful login
      router.replace('/admin/dashboard');

    } catch (error: any) {
      console.error('Login error:', error);
      // Show specific error message
      toast.error(error.message || "Login failed. Please try again.");
      // Optionally set form errors if API provides field-specific details
      // form.setError('username', { type: 'manual', message: 'Invalid credentials' });
      // form.setError('password', { type: 'manual', message: 'Invalid credentials' });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4"> {/* Added padding for small screens */}
      <div className="w-full max-w-md p-8 md:p-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Login</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        {...field}
                        placeholder="Enter your username"
                        className="pl-10"
                        aria-invalid={form.formState.errors.username ? "true" : "false"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        aria-invalid={form.formState.errors.password ? "true" : "false"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center"> {/* Centered spinner */}
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>Back to <a href="/" className="text-purple-600 dark:text-purple-400 hover:underline">Portfolio</a></p>
          {/* Only show default credentials hint in development */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <p className="mt-2">Default credentials: admin / admin123</p>
              <p className="mt-1 text-xs">Note: Change these credentials after first login.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}