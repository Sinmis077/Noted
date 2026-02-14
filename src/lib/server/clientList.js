// Stores all connected clients
import { logger } from '$lib/server/logger.js';

/** @type {Map<string, Map<string, (eventName:string,data:string)=>import('sveltekit-sse').Unsafe<void,Error>>>} **/
export const clients = new Map();

/** @type {function(workspaceId:string,eventName:string,msg:*)} **/
/** @returns void **/
export function sendMessage(passphrase, eventName, msg) {
	if(clients.size === 0 || !clients.has(passphrase)) {
		logger.warn(`Server attempted to send a message to a board that doesn't have any members`);
		return;
	}

	if (!passphrase) throw new Error('No workspaceId provided');

	const clientList = clients.get(passphrase);

	if (!clientList) {
		logger.error(`No clients are connected to the ${passphrase} workspace even though the server expected them to exist`);

		return;
	}

	clientList.forEach((emit) => {
		const { error } = emit(eventName, JSON.stringify(msg));

		if (error) {
			logger.warn(error);
		}
	});
}