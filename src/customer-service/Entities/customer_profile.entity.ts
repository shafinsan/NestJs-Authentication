
import { User } from 'src/auth/Entity/User.entity';
import { Entity, OneToOne, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  currentLocation: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  hometown: string;
}