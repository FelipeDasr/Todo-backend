import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Entity,
    Column,
} from 'typeorm';

import { Task } from './Task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    firstname: string;

    @Column({ length: 50 })
    lastname: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 200, select: false })
    password: string;

    @Column({ length: 200, select: false })
    tokenToChangePassword: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[]
}