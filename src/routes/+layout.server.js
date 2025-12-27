export async function load({ cookies, fetch }) {
	const passphrase = cookies.get('passphrase');

	return {
		hasPassphrase: Boolean(passphrase),
		isHealthy: fetch("/api/health").then((response) => response.ok),
		passphrase
	};
}
