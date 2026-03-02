import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body;
      const newUser = await this.authService.createUser(username, email, password);
      return res.status(201).json(newUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ message });
    }
  }

  public async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ message });
    }
  }
}

export default AuthController;