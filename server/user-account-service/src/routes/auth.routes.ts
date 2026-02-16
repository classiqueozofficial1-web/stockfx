import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/register
 * Register new user and send verification email
 * Body: { username, email, password, firstName? }
 */
router.post('/register', (req: Request, res: Response) =>
  authController.registerUser(req, res)
);

/**
 * POST /api/auth/verify-email
 * Verify email with token from email link
 * Body or Query: { token }
 */
router.post('/verify-email', (req: Request, res: Response) =>
  authController.verifyEmail(req, res)
);

/**
 * GET /api/auth/verify-email
 * Verify email with token from email link (support for link clicks)
 * Query: ?token=xxxxx
 */
router.get('/verify-email', (req: Request, res: Response) =>
  authController.verifyEmail(req, res)
);

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 * Body: { email }
 */
router.post('/resend-verification', (req: Request, res: Response) =>
  authController.resendVerificationEmail(req, res)
);

/**
 * POST /api/auth/login
 * Login user (requires verified email)
 * Body: { email, password }
 */
router.post('/login', (req: Request, res: Response) =>
  authController.loginUser(req, res)
);

export default router;