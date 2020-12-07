const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

module.exports = {
    generateHash: async function(password) {
        const salt = await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password, salt);
    },
    validateHash: async function(password, hash) {
        return bcrypt.compare(password, hash);
    }
}