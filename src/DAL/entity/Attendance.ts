import {Entity, ObjectIdColumn, ObjectID, Column, Unique} from "typeorm";

@Entity()
export class Attendance {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    subjectId: string;

    @Column()
    teacherId: string;

    @Column()
    studentId: string;

    @Column()
    date: string;

    @Column()
    isPresent: boolean;

    @Column()
    createdDate: Date;

    @Column()
    createdBy: string;
}
