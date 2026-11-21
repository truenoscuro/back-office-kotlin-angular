import { PermissionKey } from '../../../core/security/permission-keys.type';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  role: string;
  permissions: PermissionKey[];
}
