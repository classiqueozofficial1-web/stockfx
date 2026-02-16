import { User, UserStatus } from '../models/user.model';
import prismaClient from '../db/client';

export class UserRepository {
  constructor() {}

  async createUser(data: User): Promise<User> {
    return await prismaClient.user.create({
      data: {
        ...data,
        status: 'ACTIVE'
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by email verification token
   */
  async findUserByVerificationToken(token: string): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: { emailVerificationToken: token },
    });
  }

  /**
   * Verify user email and clear token
   */
  async verifyEmail(userId: number): Promise<User> {
    return await prismaClient.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }

  /**
   * Update verification token (for resend)
   */
  async updateUserVerificationToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<User> {
    return await prismaClient.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expiresAt,
      },
    });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return await prismaClient.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete - user is archived but data is preserved
   * DO NOT use hard delete to ensure data is never lost
   */
  async archiveUser(id: number): Promise<User> {
    return await prismaClient.user.update({
      where: { id },
      data: {
        status: 'ARCHIVED'
      },
    });
  }

  /**
   * Get all users with optional filtering
   */
  async getAllUsers(options: {
    status?: UserStatus;
    role?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<any> {
    const { status, role, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prismaClient.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          role: true,
          investmentAmount: true,
          lastLoginAt: true,
          createdAt: true,
          terminatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prismaClient.user.count({ where })
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update user status with optional termination reason
   */
  async updateUserStatus(
    id: number,
    status: UserStatus,
    terminationReason?: string
  ): Promise<User> {
    const updateData: any = {
      status
    };

    if (status === 'TERMINATED') {
      updateData.terminatedAt = new Date();
      if (terminationReason) {
        updateData.terminationReason = terminationReason;
      }
    }

    if (status === 'ACTIVE') {
      updateData.terminatedAt = null;
      updateData.terminationReason = null;
    }

    return await prismaClient.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Record login activity
   */
  async recordLogin(id: number): Promise<User> {
    return await prismaClient.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        loginCount: {
          increment: 1
        }
      },
    });
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<any> {
    const [
      totalUsers,
      activeUsers,
      terminatedUsers,
      archivedUsers,
      admins
    ] = await Promise.all([
      prismaClient.user.count(),
      prismaClient.user.count({ where: { status: 'ACTIVE' } }),
      prismaClient.user.count({ where: { status: 'TERMINATED' } }),
      prismaClient.user.count({ where: { status: 'ARCHIVED' } }),
      prismaClient.user.count({ where: { role: 'ADMIN' } })
    ]);

    return {
      totalUsers,
      activeUsers,
      terminatedUsers,
      archivedUsers,
      admins,
      inactiveUsers: terminatedUsers + archivedUsers
    };
  }

  /**
   * Find active users only
   */
  async findActiveUsers(limit: number = 100): Promise<User[]> {
    return await prismaClient.user.findMany({
      where: { status: 'ACTIVE' },
      take: limit,
      orderBy: { lastLoginAt: 'desc' }
    });
  }

  /**
   * Find all users by status
   */
  async findUsersByStatus(status: UserStatus): Promise<User[]> {
    return await prismaClient.user.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Export all user data (no deletion, full preservation)
   */
  async exportAllUserData(): Promise<any> {
    return await prismaClient.user.findMany({
      include: {
        auditLogs: true,
        sessions: true
      }
    });
  }

  /**
   * Create admin user
   */
  async createAdminUser(data: User): Promise<User> {
    return await prismaClient.user.create({
      data: {
        ...data,
        role: 'ADMIN',
        status: 'ACTIVE'
      },
    });
  }

  /**
   * Find all admins
   */
  async findAllAdmins(): Promise<User[]> {
    return await prismaClient.user.findMany({
      where: { role: 'ADMIN' }
    });
  }
}