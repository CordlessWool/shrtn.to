import {
	DAY_IN_MS,
	HOUR_IN_MS,
	MAX_TTL_TEMP,
	MAX_TTL_USER,
	MONTH_IN_MS,
	TTL_STEPS,
	WEEK_IN_MS,
	YEAR_IN_MS,
	SHORTEN_LENGTH,
	THEME
} from '$lib/helper/defaults';
import { nanoid } from 'nanoid';

import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

export const getString = (
	value: string | FormDataEntryValue | null,
	defaultValue?: string | (() => string)
) => {
	if (value != null) {
		const string = String(value);
		return string;
	} else if (defaultValue != null) {
		if (typeof defaultValue === 'string') {
			return defaultValue;
		}
		return defaultValue();
	}

	throw new Error('Value is required');
};

const TTLs = [
	[HOUR_IN_MS, 'anhour'],
	[DAY_IN_MS, 'aday'],
	[WEEK_IN_MS, 'aweek'],
	[MONTH_IN_MS, 'amonth'],
	[YEAR_IN_MS, 'ayear'],
	[Infinity, 'forever']
] as const;

export const ttlFromStep = (step: TTL_STEPS): number => {
	return TTLs[step][0];
};

const ttlMapFromStep = (step: TTL_STEPS): [number, string][] => {
	return TTLs.slice(0, step + 1) as [number, string][];
};
const getTTLTempUser = (): [number, string][] => ttlMapFromStep(MAX_TTL_TEMP);
const getTTLUser = (): [number, string][] => ttlMapFromStep(MAX_TTL_USER);

export const getTTLs = (loggedin: boolean) => (loggedin ? getTTLUser() : getTTLTempUser());

const LinkValueSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(2, m.error_link_min_lenght),
	v.transform((url) => (url.match(/^[A-Za-z]+:\/\//) ? url : `https://${url}`)),
	v.url(m.error_invalid_url)
);

export const LinkSchemaSignedUp = v.object({
	link: LinkValueSchema,
	ttl: v.pipe(v.optional(v.number(), HOUR_IN_MS), v.maxValue(ttlFromStep(MAX_TTL_USER))),
	short: v.pipe(
		v.fallback(v.pipe(v.string(), v.trim(), v.minLength(1)), () => nanoid(SHORTEN_LENGTH))
	)
});

export const LinkSchemaTemp = v.object({
	link: LinkValueSchema,
	ttl: v.pipe(v.optional(v.number(), HOUR_IN_MS), v.maxValue(ttlFromStep(MAX_TTL_TEMP))),
	short: v.pipe(
		v.fallback(v.pipe(v.string(), v.trim(), v.minLength(1)), () => nanoid(SHORTEN_LENGTH))
	)
});

export const getLinkSchema = (loggedin: boolean) =>
	loggedin ? LinkSchemaSignedUp : LinkSchemaTemp;

export const LoginMailSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email(m.error_invalid_email)),
	theme: v.optional(v.pipe(v.number(), v.enum(THEME)))
});

export const VerificationSchema = v.object({
	key: v.pipe(v.string(), v.trim(), v.minLength(1, m.error_empty_key), v.toLowerCase())
});

export const ThemeSchema = v.object({
	theme: v.optional(v.pipe(v.number(), v.enum(THEME)))
});
