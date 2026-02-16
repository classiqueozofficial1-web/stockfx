# Permanent User Data Storage System

## Overview

This system ensures that all user data is stored permanently in a database with the following features:

- **No Data Loss**: User data is never permanently deleted
- **Admin-Only Control**: Only administrators can terminate or archive users
- **Audit Trail**: Complete audit trail of all actions
- **Soft Delete**: Users are marked as terminated/archived but data is preserved
- **Data Recovery**: Terminated users can be restored by admin
- **GDPR Compliance**: Full data export capabilities

## Key Features

### User Status System

Users can have one of three statuses:
- **ACTIVE**: Normal user account
- **TERMINATED**: User account is terminated but data is preserved
- **ARCHIVED**: User data is archived (soft deleted)

### User Roles

- **USER**: Regular user
- **ADMIN**: Administrator with full control

### Database Schema

#### User Model
```
- id (Int, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- firstName, lastName (Optional)
- status (Enum: ACTIVE, TERMINATED, ARCHIVED)
- role (Enum: USER, ADMIN)
- phoneNumber, address, city, country (Optional)
- investmentAmount (Float)
- portfolio (JSON - flexible structure)
- lastLoginAt, loginCount (Tracking)
- createdAt, updatedAt (Timestamps)
- terminatedAt, terminationReason (Termination info)
```

#### AuditLog Model
```
- id (Int, Primary Key)
- userId (Foreign Key)
- actionType (String: USER_DELETED, USER_TERMINATED, DATA_EXPORTED, etc.)
- description (String)
- oldData (JSON - previous user data)
- newData (JSON - new user data)
- performedBy (Admin ID)
- ipAddress, userAgent (Request info)
- createdAt (Timestamp)
```

## Admin API Endpoints

All admin endpoints require:
1. Valid JWT token in Authorization header: `Bearer <token>`
2. User must have ADMIN role

### User Management

#### Get All Users
```
GET /api/admin/users
Query Parameters:
  - status: ACTIVE | TERMINATED | ARCHIVED
  - role: USER | ADMIN
  - page: 1 (default)
  - limit: 20 (default)
```

#### Get User by ID
```
GET /api/admin/users/:id
Response includes full user data
```

#### Terminate User
```
PUT /api/admin/users/:id/terminate
Body: { reason: "Violation of ToS" }
Response: Terminated user data
```

#### Archive User (Soft Delete)
```
DELETE /api/admin/users/:id
Body: { reason: "Request from user" }
Response: Archived user data
```

#### Restore Terminated User
```
PUT /api/admin/users/:id/restore
Response: Restored user data with ACTIVE status
```

### Audit & Compliance

#### Get Audit Trail for User
```
GET /api/admin/users/:id/audit
Query Parameters:
  - page: 1 (default)
  - limit: 50 (default)
Response: List of all actions taken on this user
```

#### Get All Audit Logs
```
GET /api/admin/audit
Query Parameters:
  - actionType: USER_TERMINATED | USER_ARCHIVED | DATA_EXPORTED | etc.
  - page: 1 (default)
  - limit: 50 (default)
```

#### Export User Data (GDPR)
```
GET /api/admin/users/:id/export
Response: Complete user data in JSON format
```

#### Get Statistics
```
GET /api/admin/statistics
Response:
{
  "totalUsers": 1000,
  "activeUsers": 950,
  "terminatedUsers": 30,
  "archivedUsers": 20,
  "admins": 5,
  "inactiveUsers": 50
}
```

## Data Preservation Strategy

### What Happens When User is Terminated
1. User status changed to TERMINATED
2. terminatedAt timestamp recorded
3. terminationReason stored
4. Audit log entry created with action type USER_TERMINATED
5. User cannot login
6. All user data is preserved in database

### What Happens When User is Archived
1. User status changed to ARCHIVED
2. Audit log entry created with action type USER_ARCHIVED
3. All user data is preserved
4. User cannot login or access any services
5. Data can still be exported

### Hard Delete - NEVER USED
The system explicitly NEVER performs hard deletes. The old `deleteUser()` method that performed hard deletion has been replaced with soft delete (`archiveUser()`).

## Audit Trail

Every action taken by an admin is logged with:
- Timestamp
- Admin ID
- Action type (TERMINATE, ARCHIVE, RESTORE, etc.)
- Previous user data
- New user data
- IP address
- User agent

This allows complete traceability of all actions.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/stockfx"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
PORT=3000
```

### 3. Run Prisma Migrations
```bash
npx prisma migrate dev --name initial_setup
```

### 4. Create Admin User
```bash
npx prisma db seed
```

Or create manually:
```sql
INSERT INTO "User" (username, email, password, role, status)
VALUES ('admin', 'admin@stockfx.com', '<hashed-password>', 'ADMIN', 'ACTIVE');
```

### 5. Start Server
```bash
npm run dev
```

## Example Usage

### Terminate a User
```bash
curl -X PUT http://localhost:3000/api/admin/users/123/terminate \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Violation of terms of service"}'
```

### View User Audit Trail
```bash
curl http://localhost:3000/api/admin/users/123/audit \
  -H "Authorization: Bearer <admin-token>"
```

### Export User Data
```bash
curl http://localhost:3000/api/admin/users/123/export \
  -H "Authorization: Bearer <admin-token>" | jq . > user-data.json
```

### Get Statistics
```bash
curl http://localhost:3000/api/admin/statistics \
  -H "Authorization: Bearer <admin-token>"
```

## Security Notes

1. All admin endpoints require valid JWT token with ADMIN role
2. All actions are audited
3. Passwords are hashed and never stored in audit logs
4. IP addresses and user agents are logged for security tracking
5. Terminated/archived users cannot login
6. No data is ever permanently deleted

## Data Retention

- **Active Users**: Full access to all features
- **Terminated Users**: Data retained indefinitely, no access
- **Archived Users**: Data retained indefinitely, no access
- **Audit Logs**: Retained indefinitely for compliance

## Compliance

This system is designed to comply with:
- GDPR (right to data portability via export)
- CCPA (permanent data storage)
- SOC 2 (audit trail requirements)
- General compliance best practices
