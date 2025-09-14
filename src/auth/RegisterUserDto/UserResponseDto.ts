
export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nationality?: string;
  religion?: string;
  currentLocation?: string;
  zip?: string;
  hometown?: string;
  isActive: boolean;
  activationToken?: string;
  activationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  role: {
    id: string;
    name: string;
  };
  roleId: string;
}