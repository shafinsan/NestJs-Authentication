
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn, OneToOne } from 'typeorm';
import { EntityRole } from '../../role/ENTITY/Entity.Role';
import { CustomerProfile } from 'src/customer-service/Entities/customer_profile.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  

  @Column({ default: false })
  isActive: boolean;
  
  @Column({ nullable: true })
  profileImage: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  activationToken: string | null;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  activationTokenExpires: Date | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => EntityRole, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: EntityRole;

  @Column()
  roleId: string;

  @OneToOne(() => CustomerProfile, profile => profile.user)
  profile: CustomerProfile;

  @Column({ 
    type: 'varchar',
    nullable: true  
  })
  resetPasswordOtp: string | null;  

  @Column({ 
    type: 'timestamp', 
    nullable: true  
  })
  resetPasswordOtpExpires: Date | null; 

  @BeforeInsert()
  generateUsername() {
    this.username = `${this.firstName.toLowerCase()}_${this.lastName.toLowerCase()}`;
  }

  @BeforeInsert()
  setActivationTokenExpiry() {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    this.activationTokenExpires = expiryDate;
  }
}