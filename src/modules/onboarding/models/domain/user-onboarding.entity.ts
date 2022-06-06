import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity('user_onboarding')
export class UserOnboarding {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  deletedBy: string;

  constructor(partialEntity?: Partial<UserOnboarding>) {
    Object.assign(this, partialEntity);
  }
}
