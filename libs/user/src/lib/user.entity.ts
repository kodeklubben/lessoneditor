import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import {Lesson} from '../../../lesson/src/lib/lesson.entity'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @ManyToMany(type => Lesson,  lesson => lesson.users)

    @JoinTable()
    lessons: Lesson[];

}