import { Attendance } from "../DAL/entity/Attendance";

export {}
const routes = require('express').Router();
const mongoConnection = require('./../../src/DAL/index');
const { Subject } = require('./../../src/DAL/entity/Subject');
var ObjectId = require('mongodb').ObjectId;

//middleware to authenticate teachers related api calls
routes.use(function(req, res, next) {
    let {isTeacher} = req.userDetails;

    if(isTeacher) { 
        next()
    } else {
        res.status(405).json({message:'operation can be performed only by teacher.'});
    }
})

routes.get('/subject', async (req, res) => {
    let connection = mongoConnection.getConnection();
    try {
        let subjects = await connection.mongoManager.find(Subject);
        res.status(200).json({success: true, subjects: subjects});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

routes.post('/subject', async (req, res) => {
    let body = req.body
    let connection = mongoConnection.getConnection();
    let { id, firstName, lastName} = req.userDetails;
    try {
        let subject = new Subject();
        subject.SubjectName = body.SubjectName;
        subject.createdBy = `${firstName} ${lastName}`;
        subject.createdDate = new Date();
        subject.modifiedDate = new Date();
        subject.standard = body.standard;
        subject.teacherId = id;    

        await connection.mongoManager.save(subject)
        res.status(200).json({success: true})
    } catch (err){
        res.status(500).json({err:err.message});
    }
})

routes.put('/subject/:subjectId', async (req, res) => {
    let body = req.body;
    let subjectId = req.params.subjectId;
    let { id, firstName, lastName} = req.userDetails;
    let connection = mongoConnection.getConnection();

    try {
        let subject = new Subject();
        subject.SubjectName = body.SubjectName;
        subject.standard = body.standard;
        subject.modifiedDate = new Date();

        await connection.mongoManager.updateOne(Subject, 
            {_id: new ObjectId(subjectId), teacherId:id}, 
            { $set: subject }
            );
        res.status(200).json({success:true, message:"subject updated successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

routes.delete('/subject/:subjectId', async (req, res) => {
    let subjectId = req.params.subjectId;
    let connection = mongoConnection.getConnection();

    try {
        await connection.mongoManager.delete(Subject, { _id: new ObjectId(subjectId) });
        res.status(200).json({success: true, message: 'Subject deleted successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

routes.post('/attendance', async (req, res) => {
    let body = req.body;
    let { id, firstName, lastName} = req.userDetails;
    let connection = mongoConnection.getConnection();

    try {
        let attendance = new Attendance();
        attendance.subjectId = body.subjectId;
        attendance.teacherId = id;
        attendance.studentId = body.studentId;
        attendance.date = (new Date()).toISOString().split('T')[0];
        attendance.isPresent = body.isPresent;
        attendance.createdDate = new Date();
        attendance.createdBy = `${firstName} ${lastName}`

        await connection.mongoManager.save(attendance);
        res.status(200).json({success:true, message:"attendance added successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

routes.put('/attendance/:attendanceId', async (req, res) => { 
    let body = req.body;
    let attendanceId = req.params.attendanceId;
    let connection = mongoConnection.getConnection();
    
    try {
        let attendance = new Attendance();
        attendance.isPresent = body.isPresent;

        await connection.mongoManager.updateOne(Attendance, 
            {_id: new ObjectId(attendanceId)}, 
            { $set: attendance }
            );
        res.status(200).json({success:true, message:"attendance updated successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

module.exports = routes;
