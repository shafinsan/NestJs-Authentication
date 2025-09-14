export class ViewProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
  nationality?: string;
  religion?: string;
  currentLocation?: string;
  zip?: string;
  hometown?: string;
  role: string;
}