import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

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

export const mail = async (to: string, subject: string, text: string) => {
	await transporter.sendMail({
		from: env.MAIL_FROM,
		to,
		subject,
		text
	});
};
