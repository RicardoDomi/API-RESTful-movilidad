const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const PEPPER = process.env.PASSWORD_PEPPER || "";

async function hashPassword(plain) {
  const salted = `${plain}${PEPPER}`;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(salted, salt);
}

async function comparePassword(plain, hashed) {
  const salted = `${plain}${PEPPER}`;
  return bcrypt.compare(salted, hashed);
}

module.exports = { hashPassword, comparePassword };
