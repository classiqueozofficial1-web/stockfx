import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash.util';
import EmailService from './email.service';
import crypto from 'crypto';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Generate a verification token
   */
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Register a new user with email verification
   */
  async registerUser(username: string, email: string, password: string, firstName?: string) {
    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const user = {
      username,
      email,
      password: hashedPassword,
      firstName,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    };

    const newUser = await this.userRepository.createUser(user);

    // Send verification email
    await EmailService.sendVerificationEmail(
      email,
      verificationToken,
      firstName || username
    );

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      message: 'Verification email sent. Please check your inbox.',
    };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    // Find user by verification token
    const user = await this.userRepository.findUserByVerificationToken(token);

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Check if token has expired
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw new Error('Verification token has expired');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    // Mark email as verified and clear token
    const verifiedUser = await this.userRepository.verifyEmail(user.id);

    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.firstName || user.username);

    return {
      id: verifiedUser.id,
      email: verifiedUser.email,
      username: verifiedUser.username,
      message: 'Email verified successfully. You can now login.',
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepository.updateUserVerificationToken(
      user.id,
      verificationToken,
      verificationExpires
    );

    // Send verification email
    await EmailService.sendVerificationEmail(
      email,
      verificationToken,
      user.firstName || user.username
    );

    return {
      message: 'Verification email resent. Please check your inbox.',
    };
  }

  /**
   * Validate user login (requires verified email)
   */
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new Error('Email not verified. Please check your inbox for verification link.');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Record login
    await this.userRepository.recordLogin(user.id);

    // Return user without sensitive data
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
    };
  }
}