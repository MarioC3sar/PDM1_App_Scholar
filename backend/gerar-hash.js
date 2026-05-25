const bcrypt = require('bcrypt'); // ou 'bcryptjs'

bcrypt.hash('123456', 10).then(hash => {
    console.log(hash);
});
// Execute com: node gerar-hash.js