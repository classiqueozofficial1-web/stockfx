export enum UserStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  ARCHIVED = 'ARCHIVED'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  role?: UserRole;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  investmentAmount?: number;
  portfolio?: Record<string, any>;
  lastLoginAt?: Date;
  loginCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  terminatedAt?: Date | null;
  terminationReason?: string | null;
}

export interface UserSession {
  id?: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface AuditLog {
  id?: number;
  userId: number;
  actionType: string;
  description?: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  performedBy?: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}