import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await this.userService.updateUser(userId, updatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }
}