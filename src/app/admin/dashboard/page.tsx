// src/app/admin/dashboard/page.tsx
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React, { useState, useEffect } from 'react'; // Added React
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import resolver
import { z } from 'zod'; // Import zod
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangleIcon, CheckIcon, InboxIcon, LogOutIcon, MessageSquareIcon, SettingsIcon, UserIcon, Trash2Icon, Loader2, KeyRoundIcon } from 'lucide-react'; // Added KeyRoundIcon
// Import Form components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

// --- Schema for Password Change Form ---
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' })
    // Optional: Add complexity requirements here with .regex()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: "Password must contain uppercase, lowercase, and number." }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function AdminDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState<boolean>(false);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true); // Ensure loading state is true at start
    try {
      const response = await fetch('/api/messages'); // Assumes API route exists

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized. Redirecting to login.');
          router.push('/admin/login'); // Redirect on 401
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      // Sort messages: unread first, then by date descending
      const sortedMessages = (data.messages || []).sort((a: Message, b: Message) => {
        if (a.read !== b.read) {
          return a.read ? 1 : -1; // Unread first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      });
      setMessages(sortedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error(`Failed to load messages: ${error.message}`);
      // Potentially redirect if error indicates auth failure beyond 401
      if (error.message.includes('Unauthorized')) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/logout', { method: 'POST' });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      toast.success('Logged out successfully');
      router.push('/admin/login'); // Redirect after successful logout
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      // Update the local state optimistically or re-fetch
      setMessages(prev =>
        prev.map(message =>
          message.id === id ? { ...message, read: true } : message
        )
          .sort((a, b) => { // Re-sort after marking as read
            if (a.read !== b.read) {
              return a.read ? 1 : -1;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
      );

      toast.success('Message marked as read');
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      toast.error(`Failed to update message: ${error.message}`);
    }
  };

  // handleDeleteMessage function:
  const handleDeleteMessage = (id: string) => {
    setMessageToDeleteId(id); // Store the ID of the message to delete
    setIsDeleteAlertOpen(true); // Open the alert dialog
  };

  // confirmDeleteMessage function:
  const confirmDeleteMessage = async () => {
    if (!messageToDeleteId) return; // Safety check

    setIsDeletingMessage(true); // Set loading state for the button
    const deleteToastId = toast.loading("Deleting message...");

    try {
      // Use the correct API endpoint for deleting a specific message
      const response = await fetch(`/api/messages/${messageToDeleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete message.' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Update the local state
      setMessages(prev => prev.filter(message => message.id !== messageToDeleteId));

      toast.success('Message deleted successfully', { id: deleteToastId });
      setIsDeleteAlertOpen(false); // Close the dialog on success

    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(`Failed to delete message: ${error.message}`, { id: deleteToastId });
      // Keep dialog open on error? Or close? User preference. Closing is often less disruptive.
      setIsDeleteAlertOpen(false);
    } finally {
      setIsDeletingMessage(false); // Reset loading state
      setMessageToDeleteId(null); // Clear the stored ID
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use AM/PM
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  // --- Setup form for password change ---
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // --- Handler for Password Change Submission ---
  const handlePasswordChange = async (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    passwordForm.clearErrors(); // Clear previous errors

    try {
      const response = await fetch('/api/admin/profile/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          // Set form errors based on API response
          Object.entries(data.details as Record<string, string[]>).forEach(([key, messages]) => {
            if (key in values) { // Check if key is a valid form field name
              passwordForm.setError(key as keyof PasswordFormValues, {
                type: 'manual',
                message: messages.join(', '),
              });
            } else {
              // General error if field not found
              toast.error(`Error: ${messages.join(', ')}`);
            }
          });
        } else {
          // General error toast
          throw new Error(data.error || `Password change failed (${response.status})`);
        }
      } else {
        // Success
        toast.success(data.message || 'Password updated successfully!');
        passwordForm.reset(); // Reset form fields on success
      }

    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const unreadCount = messages.filter(message => !message.read).length;

  console.log("Rendering dashboard JSX...");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 sticky top-0 z-10"> {/* Sticky header */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between"> {/* Adjusted padding */}
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-sm" /* Ensure text size consistency */
              aria-busy={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOutIcon className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-8"> {/* Adjusted padding */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            {/* Profile Card */}
            <Card className="mb-6"> {/* Use Card component */}
              <CardContent className="p-6"> {/* Use CardContent */}
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    {/* Use a default avatar or fetch dynamically if needed */}
                    <AvatarImage src="/placeholder-avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback> {/* More generic fallback */}
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">Admin User</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Administrator</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Card */}
            <Card> {/* Wrap nav in a Card */}
              <CardContent className="p-0"> {/* Remove padding */}
                <nav> {/* No extra div needed */}
                  <Button
                    variant={activeTab === "messages" ? "secondary" : "ghost"}
                    className="w-full justify-start px-4 py-3 rounded-none border-b dark:border-zinc-700" // Added border
                    onClick={() => setActiveTab("messages")}
                  >
                    <div className="flex items-center w-full"> {/* Ensure badge is pushed right */}
                      <MessageSquareIcon className="h-4 w-4 mr-3" />
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto"> {/* Use destructive for attention */}
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </Button>

                  <Button
                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                    className="w-full justify-start px-4 py-3 rounded-none border-b dark:border-zinc-700" // Added border
                    onClick={() => setActiveTab("profile")}
                  >
                    <UserIcon className="h-4 w-4 mr-3" />
                    <span>Profile</span>
                  </Button>

                  <Button
                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                    className="w-full justify-start px-4 py-3 rounded-none" // No border for last item
                    onClick={() => setActiveTab("settings")}
                  >
                    <SettingsIcon className="h-4 w-4 mr-3" />
                    <span>Settings</span>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0"> {/* Added min-w-0 for flex shrink issues */}
            {/* We control content via state, no need for Tabs component here unless needed for styling */}
            <div className="w-full">
              {activeTab === 'messages' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquareIcon className="h-5 w-5 mr-2" />
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-3">
                          {unreadCount} unread
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Manage contact form submissions from visitors. Unread messages are highlighted.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-12 text-zinc-500">
                        <Loader2 className="h-8 w-8 animate-spin mr-3" />
                        <span>Loading messages...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                        <InboxIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-1">No messages yet</h3>
                        <p>When visitors submit the contact form, their messages will appear here.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 -mx-6"> {/* Negative margin to extend divider */}
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`px-6 py-4 transition-colors ${!message.read
                              ? 'bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50'
                              : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                              }`}
                          >
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                              <div className="flex-1 min-w-0"> {/* Allow shrinking */}
                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center text-base break-words"> {/* Break long subjects */}
                                  {message.subject}
                                  {!message.read && (
                                    <Badge variant="destructive" className="ml-2 text-xs">New</Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 break-words"> {/* Break long emails */}
                                  From: {message.name} {'<'}
                                  {message.email}
                                  {'>'}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1"> {/* Smaller date */}
                                  Received: {formatDate(message.createdAt)}
                                </p>
                              </div>

                              <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0"> {/* Prevent shrinking */}
                                {!message.read && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(message.id)}
                                    className="flex items-center gap-1"
                                    title="Mark as Read"
                                  >
                                    <CheckIcon className="h-4 w-4" /> {/* Slightly larger icon */}
                                    <span className="hidden sm:inline">Mark Read</span> {/* Hide text on small screens */}
                                  </Button>
                                )}

                                {/* --- START: AlertDialog Implementation --- */}
                                <AlertDialog open={isDeleteAlertOpen && messageToDeleteId === message.id} onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
                                  // Only trigger state changes related to this specific dialog instance
                                  if (messageToDeleteId === message.id) {
                                    setIsDeleteAlertOpen(open);
                                    if (!open) {
                                      // Reset message ID if dialog is closed (e.g., by clicking overlay/cancel)
                                      setMessageToDeleteId(null);
                                    }
                                  }
                                }}>
                                  <AlertDialogTrigger asChild>
                                    {/* This button now triggers the dialog */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300 flex items-center gap-1"
                                      title="Delete Message"
                                      onClick={() => handleDeleteMessage(message.id)} // Opens the dialog via state change
                                    >
                                      <Trash2Icon className="h-4 w-4" />
                                      <span className="hidden sm:inline">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  {/* Render content only if this is the message being targeted */}
                                  {messageToDeleteId === message.id && (
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the message
                                          from <span className="font-medium">{message.name || 'Unknown Sender'}</span> about "{message.subject}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeletingMessage}> {/* Disable if deleting */}
                                          Cancel
                                        </AlertDialogCancel>
                                        {/* Action button calls the new confirmation function */}
                                        <AlertDialogAction
                                          onClick={confirmDeleteMessage}
                                          disabled={isDeletingMessage} // Disable while deleting
                                          className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" // Style as destructive
                                        >
                                          {isDeletingMessage ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Deleting...
                                            </>
                                          ) : (
                                            'Yes, delete message'
                                          )}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  )}
                                </AlertDialog>
                                {/* --- END: AlertDialog Implementation --- */}

                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300 flex items-center gap-1"
                                  onClick={() => handleDeleteMessage(message.id)}
                                  title="Delete Message"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                </Button> */}
                              </div>
                            </div>

                            <div className="mt-3 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-md whitespace-pre-wrap text-sm"> {/* pre-wrap to preserve formatting */}
                              {message.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* --- Profile Tab Content (UPDATED) --- */}
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Update your administrator password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* --- Password Change Form --- */}
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6 max-w-md">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <KeyRoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                  <Input type="password" placeholder="Enter your current password" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <KeyRoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                  <Input type="password" placeholder="Enter new password (min. 8 chars)" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              {/* Optional: Add password strength indicator here */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <KeyRoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                  <Input type="password" placeholder="Confirm your new password" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isChangingPassword} aria-busy={isChangingPassword}>
                          {isChangingPassword ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                              Updating...
                            </span>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </form>
                    </Form>
                    {/* --- End Password Change Form --- */}
                  </CardContent>
                </Card>
              )}

              {/* --- Settings Tab Content (Keep As Is, but fix button action) --- */}
              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SettingsIcon className="h-5 w-5 mr-2" />
                      <span>Dashboard Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Configure your dashboard preferences and account security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
                      <AlertTriangleIcon className="h-12 w-12 mx-auto mb-4 text-yellow-500 opacity-80" /> {/* Warning color */}
                      <h3 className="text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-200">Security Alert</h3>
                      <p className="max-w-md text-center mb-4">
                        For security reasons, it's highly recommended to change the default administrator password.
                      </p>
                      <Button
                        onClick={() => setActiveTab('profile')} // Navigate to profile tab
                        variant="destructive" // Emphasize importance
                      >
                        Change Password
                      </Button>
                      {/* Add more settings options here later */}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}