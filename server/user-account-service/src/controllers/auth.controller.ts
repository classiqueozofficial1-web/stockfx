import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user and send verification email
   */
  public async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password, firstName } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      const result = await this.authService.registerUser(username, email, password, firstName);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Verify email with token
   */
  public async verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body || req.query;

      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }

      const result = await this.authService.verifyEmail(token as string);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Resend verification email
   */
  public async resendVerificationEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const result = await this.authService.resendVerificationEmail(email);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Login user (requires verified email)
   */
  public async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await this.authService.validateUser(email, password);
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error: any) {
      // Check if error is about unverified email
      if (error.message.includes('Email not verified')) {
        return res.status(403).json({ message: error.message, code: 'EMAIL_NOT_VERIFIED' });
      }
      return res.status(400).json({ message: error.message });
    }
  }
}

export default AuthController;