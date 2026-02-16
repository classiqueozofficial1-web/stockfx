import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuditLogRepository } from '../repositories/audit.repository';

export class AdminController {
  private userRepository: UserRepository;
  private auditRepository: AuditLogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditRepository = new AuditLogRepository();
  }

  /**
   * Get all users with optional filtering
   */
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { status, role, page = 1, limit = 20 } = req.query;
      const users = await this.userRepository.getAllUsers({
        status: status as string,
        role: role as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Get user by ID with full details
   */
  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Terminate a user (keeps data archived, user cannot login)
   */
  public async terminateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user?.id;

      const user = await this.userRepository.findUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Archive user data before termination
      await this.auditRepository.createAuditLog({
        userId: parseInt(id),
        actionType: 'USER_TERMINATED',
        description: `User terminated by admin. Reason: ${reason || 'No reason provided'}`,
        oldData: user,
        performedBy: adminId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      // Update user status
      const terminatedUser = await this.userRepository.updateUserStatus(
        parseInt(id),
        'TERMINATED',
        reason
      );

      return res.status(200).json({
        message: 'User terminated successfully',
        user: terminatedUser
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Archive user data permanently (soft delete - no access but data preserved)
   */
  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user?.id;

      const user = await this.userRepository.findUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Archive user data
      await this.auditRepository.createAuditLog({
        userId: parseInt(id),
        actionType: 'USER_ARCHIVED',
        description: `User data archived by admin. Reason: ${reason || 'No reason provided'}`,
        oldData: user,
        performedBy: adminId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      // Update user status to archived
      const archivedUser = await this.userRepository.updateUserStatus(
        parseInt(id),
        'ARCHIVED',
        reason
      );

      return res.status(200).json({
        message: 'User data archived successfully',
        user: archivedUser
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Get audit trail for a specific user
   */
  public async getUserAuditTrail(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const auditLogs = await this.auditRepository.getAuditLogsByUserId(
        parseInt(id),
        parseInt(page as string),
        parseInt(limit as string)
      );

      return res.status(200).json(auditLogs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Get all audit logs (admin activity)
   */
  public async getAllAuditLogs(req: Request, res: Response): Promise<Response> {
    try {
      const { actionType, page = 1, limit = 50 } = req.query;
      const auditLogs = await this.auditRepository.getAllAuditLogs({
        actionType: actionType as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });
      return res.status(200).json(auditLogs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Export user data (GDPR compliance)
   */
  public async exportUserData(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      const user = await this.userRepository.findUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log the export
      await this.auditRepository.createAuditLog({
        userId: parseInt(id),
        actionType: 'DATA_EXPORTED',
        description: 'User data exported for GDPR compliance',
        performedBy: adminId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(200).json({
        message: 'User data exported successfully',
        data: user
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Get user statistics
   */
  public async getUserStatistics(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await this.userRepository.getUserStatistics();
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Restore a terminated user
   */
  public async restoreUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      const user = await this.userRepository.findUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log the restoration
      await this.auditRepository.createAuditLog({
        userId: parseInt(id),
        actionType: 'USER_RESTORED',
        description: 'User account restored by admin',
        oldData: user,
        performedBy: adminId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      // Restore user
      const restoredUser = await this.userRepository.updateUserStatus(
        parseInt(id),
        'ACTIVE',
        null
      );

      return res.status(200).json({
        message: 'User restored successfully',
        user: restoredUser
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default AdminController;
