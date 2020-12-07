export {};
const jwtProvider = require('./../utils/jwt.service');
const redisProvider = require('./../utils/redis.service');

async function validateAuthentication( req, res, next) {
    if(['/login', '/signup', '/'].includes(req.path)){
        next();
    } else {
        let headers = req.headers;
        if(headers && headers.token) {
            let decodedData = await jwtProvider.verifyToken(headers.token);
            if(decodedData && decodedData.data) {
                let loginData = JSON.parse(decodedData.data);
                let redisData = await redisProvider.getKey(loginData.username);
                if(loginData && redisData) {
                    req.userDetails = loginData;
                    next();
                } else {
                    res.status('401').json({message: 'Invalid request'})
                }
            } else {
                res.status('401').json({message: 'Invalid request'})
            }
        } else {
            res.status('401').json({message: 'Invalid request'})
        }
    }
}

module.exports  = {
    validateAuthentication: validateAuthentication
}