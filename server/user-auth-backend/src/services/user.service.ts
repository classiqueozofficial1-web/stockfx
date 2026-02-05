import { User } from '../types';
import { prisma } from '../config';

export class UserService {
  async createUser(data: User) {
    return await prisma.user.create({
      data,
    });
  }

  async getUser(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Partial<User>) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}