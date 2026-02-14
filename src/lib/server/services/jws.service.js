import jwt from 'jsonwebtoken';
import { logger } from '$lib/server/logger.js';

// 256+ bit secret and expiry in milliseconds
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = parseInt(process.env.JWT_EXPIRY);

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
		logger.warn("JWT verification failed, either token expired or had a different JWT secret sign it");
		logger.warn(err);
		return null;
	}
}
