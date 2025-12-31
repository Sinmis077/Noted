import jwt from 'jsonwebtoken';
import { JWT_EXPIRY } from '$env/static/private';

// 256+ bit secret and expiry in milliseconds
const jwtSecret = process.env.JWT_SECRET;
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
		jwtSecret
	);
}

export function extractPayload(token) {
	if (!token) return null;

	try {
		return jwt.verify(token, jwtSecret, {
			issuer: 'Noted'
		});
	} catch (err) {
		console.error(err);
		return null;
	}
}
