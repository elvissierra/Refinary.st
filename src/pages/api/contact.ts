import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const ALLOWED_ORIGINS = new Set([
	'https://refinery-st.app',
	'https://www.refinery-st.app',
]);
const ALLOWED_HOSTS = new Set(['refinery-st.app', 'www.refinery-st.app']);
const PROJECT_TYPES = new Set([
	'CAD design',
	'3D printing',
	'Product development',
	'Something else',
]);

const TIMELINES = new Set(['Flexible', 'Within a month', 'Within two weeks', 'Urgent']);

const json = (body: Record<string, unknown>, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});

const escapeHtml = (s: string) =>
	s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request }) => {
	const origin = request.headers.get('Origin') ?? '';
	const isLocalDev = import.meta.env.DEV;
	if (!isLocalDev && !ALLOWED_ORIGINS.has(origin) && !/^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev$/.test(origin)) {
		return json({ error: 'Forbidden' }, 403);
	}

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return json({ error: 'Invalid request' }, 400);
	}

	// Honeypot: real users never fill this. Pretend success so bots learn nothing.
	if (String(form.get('website') ?? '').length > 0) return json({ ok: true });

	const name = String(form.get('name') ?? '').trim();
	const email = String(form.get('email') ?? '').trim();
	const projectType = String(form.get('project-type') ?? '').trim();
	const timeline = String(form.get('timeline') ?? '').trim();
	const message = String(form.get('message') ?? '').trim();
	const token = String(form.get('cf-turnstile-response') ?? '');

	if (!name || name.length > 100) return json({ error: 'Please enter your name.' }, 400);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
		return json({ error: 'Please enter a valid email.' }, 400);
	if (!PROJECT_TYPES.has(projectType)) return json({ error: 'Please choose a project type.' }, 400);
	if (!TIMELINES.has(timeline)) return json({ error: 'Please choose a timeline.' }, 400);
	if (message.length < 10 || message.length > 5000)
		return json({ error: 'Please describe your project (10–5000 characters).' }, 400);
	if (!token) return json({ error: 'Please complete the verification.' }, 400);

	const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: new URLSearchParams({
			secret: env.TURNSTILE_SECRET_KEY,
			response: token,
			remoteip: request.headers.get('CF-Connecting-IP') ?? '',
		}),
	});
	const verdict = (await verify.json()) as { success: boolean; action?: string; hostname?: string; 'error-codes'?: string[] };
	const hostOk = import.meta.env.DEV || ALLOWED_HOSTS.has(verdict.hostname ?? '') || (verdict.hostname ?? '').endsWith('.workers.dev');
	if (!verdict.success || verdict.action !== 'contact' || !hostOk) {
		console.error('Turnstile rejected', {
			success: verdict.success,
			codes: verdict['error-codes'],
			action: verdict.action,
			hostname: verdict.hostname,
			secretSet: Boolean(env.TURNSTILE_SECRET_KEY),
		});
		return json({ error: 'Verification failed. Please try again.' }, 400);
	}

	const send = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: env.CONTACT_FROM,
			to: [env.CONTACT_TO],
			reply_to: email,
			subject: `New inquiry: ${projectType} — ${name}`.replace(/[\r\n]/g, ' '),
			html: `<p><b>Name:</b> ${escapeHtml(name)}</p>
<p><b>Email:</b> ${escapeHtml(email)}</p>
<p><b>Type:</b> ${escapeHtml(projectType)}</p>
<p><b>Timeline:</b> ${escapeHtml(timeline)}</p>
<p><b>Details:</b></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
		}),
	});
	if (!send.ok) {
		console.error('Resend failed', send.status, await send.text());
		return json({ error: 'Could not send your inquiry. Please email us directly.' }, 502);
	}
	return json({ ok: true });
};
