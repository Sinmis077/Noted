import { error } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { logger } from '$lib/server/logger.js';
import { clients } from '$lib/server/clientList.js';

export function POST({ locals: { sessionId } }) {
	if(!sessionId) throw error(400, 'MISSING SESSION ID');

	return produce(async function start({ emit }) {
		logger.debug('SSE connection established');

		const { error } =	emit('health', 'ok');

		if(error) {
			logger.error(error);
		}

		clients.set(sessionId, emit);
	},
	{
		stop() {
			logger.debug(`SSE connection closed for session ${sessionId}`);

			clients.delete(sessionId);
		}
	});
}