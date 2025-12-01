import { Request } from 'express';

import { AuthUserPayload } from './auth-user.payload';

export type AuthenticatedRequest = Request & { user?: AuthUserPayload };
