// src/components/sections/contact-section.tsx
"use client"

import { useRef, useState, useEffect  } from 'react'
import { motion, useInView } from 'framer-motion'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MapPinIcon, MailIcon, PhoneIcon, SendIcon, CheckCircleIcon, ConstructionIcon, InfoIcon, Loader2 } from 'lucide-react'

// Contact form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// --- Control flag ---
const isContactFormActive = false;

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // --- NEW: State for contact form status ---
  const [isContactFormActive, setIsContactFormActive] = useState<boolean | null>(null); // Start as null to indicate loading
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);

  // --- NEW: Fetch status on mount ---
  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoadingStatus(true); // Set loading true at the start
      try {
        const response = await fetch('/api/settings/contact-form'); // Fetch from public endpoint
        if (!response.ok) {
           console.error(`Failed to fetch contact status: ${response.statusText}`);
           // Decide default behavior on error - often safest to assume inactive
           setIsContactFormActive(false);
           return; // Exit early
        }
        const data = await response.json();
        setIsContactFormActive(data.isActive);
      } catch (error) {
        console.error('Error fetching contact form status:', error);
        // Default to inactive on fetch error
        setIsContactFormActive(false);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchStatus();
  }, []); // Empty dependency array means run once on mount

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, you would submit to an API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Show success state
      setIsSuccess(true)
      toast.success("Message sent successfully! I'll get back to you soon.");
      form.reset();

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="contact" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500">
                Get In Touch
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 mx-auto" />
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Have a project in mind or want to discuss a potential collaboration?
              Feel free to reach out using the form below or contact me directly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm h-full">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                  Contact Information
                </h3>

                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                      <MailIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    {/* Add min-w-0 to allow shrinking */}
                    <div className="min-w-0">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Email</h4>
                      <a
                        href="mailto:paluga.willardjames.arlan@gmail.com"
                        className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors break-words"
                      >
                        paluga.willardjames.arlan@gmail.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                      <PhoneIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Phone</h4>
                      <a
                        href="tel:+1234567890"
                        className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        +63 912-211-7178
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-full mr-4">
                      <MapPinIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Location</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Quezon City, Philippines
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-12">
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                    Follow Me
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/wilardzysenpai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/in/hachiki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/hachiki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm min-h-[500px] flex flex-col">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                  Send a Message
                </h3>

                {/* === CONDITIONAL RENDERING START === */}
                {isLoadingStatus ? ( // Show loading state first
                   <div className="flex-grow flex flex-col items-center justify-center text-center py-12 px-4">
                     <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-zinc-500" />
                   </div>
                ) : isContactFormActive === true ? ( // Check for explicit true
                  <>
                    {isSuccess ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                        <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                          Message Sent!
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-center">
                          Thank you for reaching out. I'll get back to you as soon as possible.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6"
                          onClick={() => setIsSuccess(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input placeholder="What is this about?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell me about your project or inquiry..."
                                    className="resize-none min-h-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <SendIcon className="mr-2 h-4 w-4" /> Send Message
                              </span>
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </>
                ) : ( // Render disabled message if status is false or null (after loading)
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                    <ConstructionIcon className="h-12 w-12 text-amber-500 mb-4" />
                    <h4 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      Contact Form Currently Unavailable
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      This form is under maintenance or temporarily disabled. Please use the contact details provided.
                    </p>
                  </div>
                )}
                {/* === CONDITIONAL RENDERING END === */}

              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
