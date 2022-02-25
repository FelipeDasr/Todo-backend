import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Entity,
    Column,
} from 'typeorm';

import { User } from './User.entity'

import { ETaskPriority } from '../types/TaskTypes';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    taskId: string;

    @Column({ length: 150 })
    title: string;

    @Column({ length: 250, nullable: true })
    description: string | null;

    @Column({
        type: 'enum',
        enum: ETaskPriority,
        default: ETaskPriority.LOW
    })
    priority: ETaskPriority;

    @Column({ type: 'boolean', default: false })
    done: boolean;

    @Column()
    dueDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.tasks)
    user: User;
}