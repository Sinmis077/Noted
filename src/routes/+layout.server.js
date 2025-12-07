export async function load({ cookies }) {
	const passphrase = cookies.get('passphrase');

	return {
		hasPassphrase: Boolean(passphrase),
		passphrase
	};
}
