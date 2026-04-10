import { edenTreaty } from '@elysiajs/eden';
import type { App } from '../../../backend/src/index';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

const client = edenTreaty<App>(PUBLIC_BACKEND_URL || 'http://localhost:3000');

export { client };
