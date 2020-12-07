import {Entity, ObjectIdColumn, ObjectID, Column, Unique} from "typeorm";

@Entity()
export class Subject {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    SubjectName: string;

    @Column()
    standard: string;

    @Column()
    teacherId: string;

    @Column()
    createdBy: string;

    @Column()
    createdDate: Date;

    @Column()
    modifiedDate: Date;
}
