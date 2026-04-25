'use server';

import { Resend } from 'resend';
import { contact } from '@/content/contact';
import { contactSchema, type ContactInput, type ContactResult } from './contact-schema';

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const subject = encodeURIComponent(`Hello from ${parsed.data.name}`);
    const body = encodeURIComponent(parsed.data.message);
    return {
      status: 'fallback',
      mailtoHref: `mailto:${contact.email}?subject=${subject}&body=${body}`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: contact.email,
      replyTo: parsed.data.email,
      subject: `[portfolio] ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    return { status: 'ok' };
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Failed to send message',
    };
  }
}
