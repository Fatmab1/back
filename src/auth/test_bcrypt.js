const bcrypt = require('bcrypt');

const realPassword = "mariem"; // 🔥 Mot de passe réel
const hash = bcrypt.hashSync(realPassword, 10);

console.log('💾 Nouveau hash généré :', hash);
