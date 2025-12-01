const bcrypt = require("bcrypt");

async function makeHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("HASH:", hash);
}

makeHash("main_daniel_12345");
