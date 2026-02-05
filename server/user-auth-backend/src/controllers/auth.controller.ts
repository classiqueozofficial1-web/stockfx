import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async createAccount(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const newUser = await this.authService.registerUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.authenticateUser(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}