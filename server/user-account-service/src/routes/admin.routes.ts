import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/admin.middleware';
import { Request, Response } from 'express';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * GET /api/admin/users
 * Get all users with optional filtering
 * Query: status, role, page, limit
 */
router.get('/users', (req: Request, res: Response) =>
  adminController.getAllUsers(req, res)
);

/**
 * GET /api/admin/users/:id
 * Get user by ID with full details
 */
router.get('/users/:id', (req: Request, res: Response) =>
  adminController.getUserById(req, res)
);

/**
 * PUT /api/admin/users/:id/terminate
 * Terminate a user (soft delete - data preserved)
 * Body: { reason: "string" }
 */
router.put('/users/:id/terminate', (req: Request, res: Response) =>
  adminController.terminateUser(req, res)
);

/**
 * DELETE /api/admin/users/:id
 * Archive user data (permanent but preserved)
 * Body: { reason: "string" }
 */
router.delete('/users/:id', (req: Request, res: Response) =>
  adminController.deleteUser(req, res)
);

/**
 * PUT /api/admin/users/:id/restore
 * Restore a terminated user
 */
router.put('/users/:id/restore', (req: Request, res: Response) =>
  adminController.restoreUser(req, res)
);

/**
 * GET /api/admin/users/:id/audit
 * Get audit trail for a specific user
 * Query: page, limit
 */
router.get('/users/:id/audit', (req: Request, res: Response) =>
  adminController.getUserAuditTrail(req, res)
);

/**
 * GET /api/admin/users/:id/export
 * Export user data (GDPR compliance)
 */
router.get('/users/:id/export', (req: Request, res: Response) =>
  adminController.exportUserData(req, res)
);

/**
 * GET /api/admin/audit
 * Get all audit logs
 * Query: actionType, page, limit
 */
router.get('/audit', (req: Request, res: Response) =>
  adminController.getAllAuditLogs(req, res)
);

/**
 * GET /api/admin/statistics
 * Get user statistics
 */
router.get('/statistics', (req: Request, res: Response) =>
  adminController.getUserStatistics(req, res)
);

export default router;
