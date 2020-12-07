const redis = require('redis')
const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
);
client.auth(process.env.REDIS_PASSWORD);

client.on('connect', function() {
    console.log('connected');
    
});

export = {
    setKey: (keyName, value) => {
        client.set(keyName, value,redis.print);
    },
    getKey: (keyName) => {
        return new Promise( function(resolve,reject) {
            return client.get(keyName, function(err, value) {
                if(err) { 
                    reject(err); 
                }
                resolve(value);
            });
        } )
    },
    deleteKey:(keyName) => client.del(keyName, redis.print)
}