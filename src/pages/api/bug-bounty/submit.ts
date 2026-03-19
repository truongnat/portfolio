import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const submitBugSchema = z.object({
  reporterName: z.string().min(2),
  reporterEmail: z.string().email(),
  title: z.string().min(10),
  description: z.string().min(50),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  category: z.enum(['security', 'functionality', 'performance', 'ui-ux', 'content', 'other']),
  affectedComponent: z.string().optional(),
  stepsToReproduce: z.string().min(20),
  expectedBehavior: z.string().min(10),
  actualBehavior: z.string().min(10),
  proofOfConcept: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData = submitBugSchema.parse(body);

    // TODO: Save to database
    // TODO: Send notification email
    // TODO: Create ticket in project management system

    const bugReport = {
      id: `bug_${Date.now()}`,
      ...validatedData,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      bountyAmount: 0, // Will be determined during triage
    };

    return new Response(
      JSON.stringify({
        success: true,
        bugReport,
        message: 'Bug report submitted successfully. You will receive a response within 48 hours.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Bug submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to submit report' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
