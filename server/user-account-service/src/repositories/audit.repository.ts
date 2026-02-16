import prismaClient from '../db/client';

export class AuditLogRepository {
  /**
   * Create an audit log entry
   */
  async createAuditLog(data: {
    userId: number;
    actionType: string;
    description?: string;
    oldData?: any;
    newData?: any;
    performedBy?: number;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prismaClient.auditLog.create({
      data: {
        userId: data.userId,
        actionType: data.actionType,
        description: data.description,
        oldData: data.oldData,
        newData: data.newData,
        performedBy: data.performedBy,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async getAuditLogsByUserId(userId: number, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prismaClient.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prismaClient.auditLog.count({ where: { userId } })
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get all audit logs with optional filtering
   */
  async getAllAuditLogs(options: {
    actionType?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { actionType, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (actionType) {
      where.actionType = actionType;
    }

    const [logs, total] = await Promise.all([
      prismaClient.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          admin: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      }),
      prismaClient.auditLog.count({ where })
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get audit logs by action type
   */
  async getAuditLogsByActionType(actionType: string, limit: number = 100) {
    return prismaClient.auditLog.findMany({
      where: { actionType },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Get total count of audit logs
   */
  async getAuditLogCount() {
    return prismaClient.auditLog.count();
  }
}
