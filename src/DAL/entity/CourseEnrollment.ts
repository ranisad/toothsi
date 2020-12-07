import {Entity, ObjectIdColumn, ObjectID, Column, Unique} from "typeorm";

@Entity()
export class CourseEnrollment {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    subjectId: string;

    @Column()
    studentId: string;

    @Column()
    createdDate: Date;
}
