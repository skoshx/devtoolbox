export function setCookie(key: string, value: string, days: number = 7) {
	let expires = '';
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 1000);
	expires = '; expires=' + date.toUTCString();
	document.cookie = key + '=' + value + expires + '; path=/';
}

export function getCookie(key: string) {
	const cookie = {};
	document.cookie.split(';').forEach((el: string) => {
		const [k, v] = el.split('=');
		cookie[k.trim()] = v;
	});
	return cookie[key];
}

export function deleteCookie(key: string) {
	document.cookie = key + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
