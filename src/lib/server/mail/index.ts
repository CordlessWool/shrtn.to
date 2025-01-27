import nodemailer from 'nodemailer';
import mustache from 'mustache';
import juice from 'juice';
import { env } from '$env/dynamic/private';
import { THEME } from '$lib/helper/defaults';
import VERIFICATION_TEMPLATE from './templates/verification.html?raw';

const connection = {
	host: env.MAIL_HOST,
	port: env.MAIL_PORT,
	secure: env.MAIL_SECURE ?? true,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASS
	}
};

const transporter = nodemailer.createTransport(
	encodeURI(`smtps://${connection.auth.user}:${connection.auth.pass}@${connection.host}`)
);

export const mail = async (to: string, subject: string, text: string, html?: string) => {
	await transporter.sendMail({
		from: env.MAIL_FROM,
		to,
		subject,
		text,
		html
	});
};

export const sendVerificationMail = async (to: string, key: string, theme: THEME = THEME.DARK) => {
	const html = mustache.render(VERIFICATION_TEMPLATE, {
		bg: theme === THEME.DARK ? '#27272a' : '#f4f4f5',
		color: theme === THEME.DARK ? '#e4e4e7' : '#27272a',
		accent: theme === THEME.DARK ? '#115e59' : '#2dd4bf',
		key
	});
	const htmlWithInlineStyles = juice(html);
	await mail(to, 'Verification', 'Please verify your email', htmlWithInlineStyles);
};
