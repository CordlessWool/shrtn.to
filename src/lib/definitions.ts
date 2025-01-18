export interface Link {
	key: string;
	url: string;
	expiresAt: Date | null;
	createdAt: Date;
}

export const MINUTE_IN_MS = 60000;
export const HOUR_IN_MS = 3600000;
export const DAY_IN_MS = 86400000;
export const WEEK_IN_MS = 604800000;
export const MONTH_IN_MS = 2592000000;
export const YEAR_IN_MS = 31536000000;
