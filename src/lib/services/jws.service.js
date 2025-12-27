import jwt from 'jsonwebtoken';

// 256+ bit secret and expiry in milliseconds
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry  = parseInt(process.env.JWT_EXPIRY);

export function generateJws(workspace) {
	return jwt.sign(
		{
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + jwtExpiry) / 1000),
			data: {
				passphrase: workspace.passphrase
			},
			iss: 'Noted'
		},
		jwtSecret
	);
}

export function extractPayload(token) {
	const { data } = isAuthenticated(token)

	return data
}

export function isAuthenticated(token) {
	if(!token) return false;

	try {
		return jwt.verify(token, jwtSecret, {
			issuer: 'Noted',
		});
	} catch (err) {
		console.error(err);
		return false;
	}
}