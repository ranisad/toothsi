export {}
const routes = require('express').Router();
const mongoConnection = require('./../DAL/index');
const { CourseEnrollment } = require('./../DAL/entity/CourseEnrollment');
const { Attendance } = require('./../DAL/entity/Attendance');
const {User} = require('./../DAL/entity/User');
const {Subject} = require('./../DAL/entity/Subject');
const _ = require('underscore');
var ObjectId = require('mongodb').ObjectId;

routes.use(function(req, res, next) {
    let {isTeacher} = req.userDetails;

    if(!isTeacher) { 
        next()
    } else {
        res.status(405).json({message:'operation can be performed only by students.'});
    }
})

routes.post('/courseEnrollment', async (req, res) => {
    let body = req.body;
    let connection = mongoConnection.getConnection();

    try {
        let courseEnrollment = new CourseEnrollment();
        courseEnrollment.subjectId = body.subjectId;
        courseEnrollment.studentId = body.studentId;
        courseEnrollment.createdDate = new Date();

        await connection.mongoManager.save(courseEnrollment)
        res.status(200).json({success: true, message: 'Course enrollment has been saved'})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

routes.get('/viewAttedance/:studentId/:subjectId', async (req, res) => {
    let {studentId, subjectId} = req.params;
    let connection = mongoConnection.getConnection();

    try {
        let attendance = new Attendance();
        

        let attendanceRecord = await connection.mongoManager.find(Attendance, {studentId: studentId, subjectId:subjectId});
        let uniqueSubject = _.pluck(_.unique(attendanceRecord,'subjectId'),'subjectId');
        let uniqueUser = (_.pluck(_.unique(attendanceRecord,'teacherId'),'teacherId')).concat(_.pluck(_.unique(attendanceRecord,'studentId'),'studentId'));

        let subjectDetails = await connection.mongoManager.find(Subject, {_id: {$in: uniqueSubject.map(subjectId => new ObjectId(subjectId))}});
        let userDetails = await connection.mongoManager.find(User, {_id: {$in: uniqueUser.map(userId => new ObjectId(userId))}});

        
        let mappedData = attendanceRecord.map(attendanceRecord => {
            let temp:any = {};
            temp._id = attendanceRecord.id.toHexString();
            temp.isPresent = attendanceRecord.isPresent;
            temp.date = attendanceRecord.date;
            temp.createdDate = attendanceRecord.createdDate;
            temp.createdBy = attendanceRecord.createdBy;
            temp.subject = subjectDetails.find(subject => subject.id.toHexString() === attendanceRecord.subjectId);
            temp.student = userDetails.find(student => student.id.toHexString() === attendanceRecord.subjectId);
            temp.teacher = userDetails.find(teacher => teacher.id.toHexString() === attendanceRecord.teacherId);

            return temp;
        });

        let finalResult = _.groupBy(mappedData, 'date');
        
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({error: error.message});
    }

})

module.exports = routes;
