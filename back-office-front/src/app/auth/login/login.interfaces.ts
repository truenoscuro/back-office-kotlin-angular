import { PermissionKey } from '../../../shared/security/permission-keys.type';

export interface LoginRequest{
  email: string;
  password: string;
}
export interface LoginResponse{
  token: string;
  role: string;
  permissions: PermissionKey[];
}
