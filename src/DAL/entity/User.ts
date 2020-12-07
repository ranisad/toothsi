import {Entity, ObjectIdColumn, ObjectID, Column, Unique} from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    isTeacher: boolean;

    @Column()
    username: string;

    @Column()
    password: string;
}
