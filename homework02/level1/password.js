const crypto = require('crypto');
const fs = require('fs');

const encrypt = (salt, password) => {
    return new Promise((res, rej) => {
        crypto.pbkdf2(password, salt.toString(), 1, 32, 'sha512', (err, derivedKey) => {
            if (err) throw err;
            res(derivedKey.toString('hex'));
        });
    });
}

fs.readFile('./password.txt', async(err, data)=>{
    if(err) throw err;
    const password = data.toString();
    const salt = crypto.randomBytes(32).toString();
    const digest = await encrypt(salt, password);

    await fs.writeFile (`./hased.txt`, digest, (err) => {
        if (err) throw err;
        console.log('successful!');
    });
})