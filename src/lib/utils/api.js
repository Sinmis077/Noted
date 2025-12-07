import axios from 'axios';

const BASE_API_URL = '/api';

const api = axios.create({
	baseURL: BASE_API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 5000
});

export { api };
