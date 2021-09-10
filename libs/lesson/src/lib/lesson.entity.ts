import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {User} from "../../../user/src/lib/user.entity";

@Entity()
export class Lesson {

    @PrimaryGeneratedColumn()
    lessonId: number;

    @Column()
    lessonSlug: string;

    @Column()
    lessonTitle: string;

    @Column()
    courseSlug: string;

    @Column()
    courseTitle: string;

    @Column()
    created_by: string;

    @Column()
    updated_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(type => FileStore, file => file.lesson,{
            cascade: true,
        })
    files: FileStore[];


    @ManyToMany(type => User, user => user.lessons)
    users: User[];

}


@Entity()
export class FileStore {

    @PrimaryGeneratedColumn()
    fileId: number;

    @Column()
    filename: string;

    @Column()
    ext: string;

    @Column("bytea")
    content: string;

    @Column()
    created_by: string;

    @Column()
    updated_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(type => Lesson, lesson => lesson.files)
    lesson: Lesson;

}