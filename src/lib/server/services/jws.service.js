import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '$env/static/private';

// 256+ bit secret and expiry in milliseconds
const jwtExpiry = parseInt(JWT_EXPIRY);

export function generateJws(workspace) {
	return jwt.sign(
		{
			expiresIn: jwtExpiry,
			data: {
				passphrase: workspace.passphrase
			},
			iss: 'Noted'
		},
		JWT_SECRET
	);
}

export function extractPayload(token) {
	if (!token) return null;

	try {
		return jwt.verify(token, JWT_SECRET, {
			issuer: 'Noted'
		});
	} catch (err) {
		console.error(err);
		return null;
	}
}
