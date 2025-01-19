import { env } from '$env/dynamic/public';
import { DAY_IN_MS, HOUR_IN_MS, MONTH_IN_MS, WEEK_IN_MS, YEAR_IN_MS } from '$lib/definitions';

export const getNumber = (
	value: string | FormDataEntryValue | null,
	defaultValue?: number
): number => {
	const number = Number(value);
	if (number) {
		return number;
	} else if (defaultValue) {
		return defaultValue;
	}

	throw new Error('Value is required');
};

export const getURL = (value: string | FormDataEntryValue | null): string => {
	if (value == null) {
		throw new Error('Value is required');
	}

	const url = String(value);
	if (url.match(/^[A-Za-z]+:\/\//)) {
		return url;
	}
	return `https://${url}`;
};

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

enum TTL_STEPS {
	HOUR,
	DAY,
	WEEK,
	MONTH,
	YEAR,
	EVER
}

const TTLs = [
	[HOUR_IN_MS, 'a hour'],
	[DAY_IN_MS, 'a day'],
	[WEEK_IN_MS, 'a week'],
	[MONTH_IN_MS, 'a month'],
	[YEAR_IN_MS, 'a year'],
	[-1, 'never']
];

const isTTLStep = (ttl: string): ttl is keyof typeof TTL_STEPS => {
	return ttl in TTL_STEPS;
};

const getTTLTempUser = (): [number, string][] => {
	const TTL_TEMP = env.PUBLIC_TTL_TEMP.toUpperCase();
	if (TTL_TEMP && isTTLStep(TTL_TEMP)) {
		return TTLs.slice(0, TTL_STEPS[TTL_TEMP] + 1) as [number, string][];
	} else {
		return TTLs.slice(0, TTL_STEPS.WEEK + 1) as [number, string][];
	}
};

const getTTLUser = (): [number, string][] => {
	const TTL_USER = env.PUBLIC_TTL_USER.toUpperCase();
	if (TTL_USER && isTTLStep(TTL_USER)) {
		return TTLs.slice(0, TTL_STEPS[TTL_USER] + 1) as [number, string][];
	} else {
		return TTLs.slice(0, TTL_STEPS.EVER + 1) as [number, string][];
	}
};
export const getTTLs = (loggedin: boolean) => (loggedin ? getTTLUser() : getTTLTempUser());
export const getMaxTTL = (loggedin: boolean) => getTTLs(loggedin)[getTTLs(loggedin).length - 1][0];
