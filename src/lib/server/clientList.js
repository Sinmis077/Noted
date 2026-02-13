// Stores all connected clients
import { logger } from '$lib/server/logger.js';

/** @type {Map<string, (eventName:string,data:string)=>import('sveltekit-sse').Unsafe<void,Error>>} **/
export const clients = new Map();

export function sendMessage(eventName, msg)	{
	clients.forEach((emit) => {
		const { error } = emit(eventName, JSON.stringify(msg));

		if (error) {
			logger.error(error);
		}
	})
}