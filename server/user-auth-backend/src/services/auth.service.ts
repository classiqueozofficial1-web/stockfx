import { User } from '../models/user.model';
import { hashPassword, verifyPassword } from '../utils/hash';
import { sign } from 'jsonwebtoken';
import { config } from '../config';

export class AuthService {
  async createAccount(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword });
    return newUser.save();
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }
}