import { IsOptional, IsUUID, Length } from "class-validator";

export class RoleDto {
  @IsOptional()
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  id: string;

  @Length(5, 50, { message: 'Name must be between 10 and 50 characters' })
  name: string;
}
