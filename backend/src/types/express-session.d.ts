import 'express-session';

import { AuthUserPayload } from '../auth/types/auth-user.payload';

declare module 'express-session' {
  interface SessionData {
    jwt?: string;
    user?: AuthUserPayload;
  }
}
