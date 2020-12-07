const jwt = require('jsonwebtoken')

export = {
    createToken: (payload) => {
        return new Promise((resolve, reject) => {
            return jwt.sign({
                data: payload
              }, process.env.PRIVATE_KEY, { expiresIn: '15d' }, (err, token) => {
                if(err) 
                    return reject(err);
                return resolve(token);
            })
        })
    },
    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.PRIVATE_KEY);
          } catch(err) {
            throw err;
          }
    }
}