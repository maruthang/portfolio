'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { contact } from '@/content/contact';
import { contactSchema, type ContactInput, type ContactResult } from './contact-schema';

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const buckets = new Map<string, number[]>();

function clientKey(headerList: Headers): string {
  const xff = headerList.get('x-forwarded-for') ?? '';
  const first = xff.split(',')[0]?.trim();
  return first || headerList.get('x-real-ip') || 'unknown';
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

const sanitizeHeader = (s: string) =>
  s
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, 200);

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.company) {
    // Honeypot tripped — silently succeed so bots don't probe behavior.
    return { status: 'ok' };
  }

  try {
    const headerList = await headers();
    const key = clientKey(headerList);
    if (!rateLimit(key)) {
      return {
        status: 'rate_limited',
        message: 'Too many messages — please try again in a bit.',
      };
    }
  } catch {
    // Outside a request context (e.g. unit tests) — skip rate limiting.
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
      subject: sanitizeHeader(`[portfolio] ${parsed.data.name}`),
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    return { status: 'ok' };
  } catch (err) {
    // Log full error server-side; return a generic message to the client.
    console.error('[contact] send failed', err);
    return {
      status: 'error',
      message: "Couldn't send right now. Try the email link instead.",
    };
  }
}
