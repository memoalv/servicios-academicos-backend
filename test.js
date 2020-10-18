const crypto = require('crypto')

console.time('1')
const salt = crypto.randomBytes(64).toString('hex'); 
const contrasena = crypto.pbkdf2Sync('secret', salt, 10000, 128, 'sha512');

console.timeEnd('1')
console.log(contrasena.length)