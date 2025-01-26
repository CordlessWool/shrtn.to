import { env } from '$env/dynamic/public';

export const MINUTE_IN_MS = 60000;
export const HOUR_IN_MS = 3600000;
export const DAY_IN_MS = 86400000;
export const WEEK_IN_MS = 604800000;
export const MONTH_IN_MS = 2592000000;
export const YEAR_IN_MS = 31536000000;

export enum TTL_STEPS {
	HOUR,
	DAY,
	WEEK,
	MONTH,
	YEAR,
	EVER
}

export enum THEME {
	DARK,
	LIGHT
}

const toTTLSTEP = (step: unknown, defaultValue: TTL_STEPS): TTL_STEPS => {
	if (typeof step !== 'string') {
		return defaultValue;
	}
	const upperStep = step.toUpperCase();
	if (upperStep in TTL_STEPS) {
		return TTL_STEPS[upperStep as keyof typeof TTL_STEPS];
	}

	throw new Error('Invalid TTL step');
};

export const SHORTEN_LENGTH = Number(env.PUBLIC_ID_LENGTH ?? 5);
export const MAX_TTL_USER = toTTLSTEP(env.PUBLIC_TTL_USER, TTL_STEPS.EVER);
export const MAX_TTL_TEMP = toTTLSTEP(env.PUBLIC_TTL_TEMP, TTL_STEPS.WEEK);
