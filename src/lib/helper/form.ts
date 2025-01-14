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
