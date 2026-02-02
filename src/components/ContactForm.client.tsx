'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { uiStrings } from '@/lib/config';
import { sendContactMessage } from '@/lib/telegram';

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const status = await sendContactMessage(data.name, data.email, data.message);
      if (!status) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.log(error);

      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-8"
      data-testid="contact-form"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 font-mono">
          {uiStrings.contact.form.nameLabel}
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full pl-12 pr-4 py-4 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:border-foreground/30 transition-all font-mono text-sm"
            placeholder={uiStrings.contact.form.namePlaceholder}
            data-testid="contact-name-input"
          />
        </div>
        {errors.name && (
          <p
            className="mt-1 text-[10px] font-mono text-destructive uppercase tracking-tight flex items-center gap-1"
            data-testid="contact-name-error"
          >
            <AlertCircle className="h-3 w-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 font-mono">
          {uiStrings.contact.form.emailLabel}
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full pl-12 pr-4 py-4 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:border-foreground/30 transition-all font-mono text-sm"
            placeholder={uiStrings.contact.form.emailPlaceholder}
            data-testid="contact-email-input"
          />
        </div>
        {errors.email && (
          <p
            className="mt-1 text-[10px] font-mono text-destructive uppercase tracking-tight flex items-center gap-1"
            data-testid="contact-email-error"
          >
            <AlertCircle className="h-3 w-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 font-mono">
          {uiStrings.contact.form.messageLabel}
        </label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <textarea
            id="message"
            {...register('message')}
            rows={6}
            className="w-full pl-12 pr-4 py-4 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:border-foreground/30 transition-all resize-none font-mono text-sm"
            placeholder={uiStrings.contact.form.messagePlaceholder}
            data-testid="contact-message-input"
          />
        </div>
        {errors.message && (
          <p
            className="mt-1 text-[10px] font-mono text-destructive uppercase tracking-tight flex items-center gap-1"
            data-testid="contact-message-error"
          >
            <AlertCircle className="h-3 w-3" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-4 bg-foreground text-background rounded-lg font-bold font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        data-testid="contact-submit-button"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            {uiStrings.contact.form.submittingButton}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {uiStrings.contact.form.submitButton}
          </>
        )}
      </button>

      {/* Response Messages */}
      <div className="min-h-[4rem]">
        <AnimatePresence mode="wait">
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-600 dark:text-green-400 backdrop-blur-sm shadow-sm"
              data-testid="contact-success-message"
            >
              <div className="p-1 bg-green-500/20 rounded-full">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              </div>
              <p className="font-medium text-sm sm:text-base">
                {uiStrings.contact.messages.success}
              </p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive backdrop-blur-sm shadow-sm"
              data-testid="contact-error-message"
            >
              <div className="p-1 bg-destructive/20 rounded-full">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              </div>
              <p className="font-medium text-sm sm:text-base">
                {errorMessage || uiStrings.contact.messages.error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

