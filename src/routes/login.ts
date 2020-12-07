const router = require('express').Router();
const mongoConnection = require('./../../src/DAL/index');
const hashFunction = require('../utils/hashing');
const jwtProvider = require('../utils/jwt.service');
const redisProvider = require('../utils/redis.service');
const { User } = require('./../../src/DAL/entity/User')

router.post('/login', async (req, res) => {
    let {username, password, isTeacher} = req.body;
    let user = new User();
    let connection = mongoConnection.getConnection();
    try {
        user.password = password;
        user.username = username;
        user.isTeacher = isTeacher;

        const users = await connection.mongoManager.findOne(User,{ username: user.username});
        if(users) {
            const isValidPassword = await hashFunction.validateHash(password, users.password);
            if(!isValidPassword) {
                res.status(200).json({success: false, message: 'Invalid password'});
            } else {
                delete users.password;
                let token = await jwtProvider.createToken(JSON.stringify(users));
                redisProvider.setKey(users.username, token);
                res.status(200).json({success: true, token: token})
            }
        } else {
            res.status(200).json({success: false, message:'No user exist for provided username'})
        }
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.post('/signup', async (req, res) => {
    try {
        let body = req.body;
        let user = new User();
        let connection = mongoConnection.getConnection();
        // const manager = getMongoManager(connection);
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.password = await hashFunction.generateHash(body.password);
        user.age = body.age;
        user.username = body.username;
        user.isTeacher = body.isTeacher;

        const users = await connection.mongoManager.findOne(User,{ username: user.username });
        if(users) {
            res.status(200).json({error: "user already exist"})
        } else {
            await connection.mongoManager.save(user)
            res.status(200).json({success: true})
        }
    } catch(err) { 
        res.status(500).json({error:err.message})
    }
})

router.post('/signout', async (req, res) => {
    let {username} = req.body
    let user = new User();
    let connection = mongoConnection.getConnection();

    if(username) {
        try {
            user.username = username;
    
            const users = await connection.mongoManager.findOne(User,{ username: user.username});

            if(users) {
                await redisProvider.deleteKey(username);
                res.status(200).json({success: true});
            } else {
                res.status(200).json({success: false, message:'Invalid username'});
            }
        }catch(err) {
            res.status(500).json({error: err.message});
        }
    } else {
        res.status(200).json({success:false, message:'Invalid username'});
    }
})
module.exports = router;