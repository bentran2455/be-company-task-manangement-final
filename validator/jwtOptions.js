const i = "Ben Tran";
const s = "admin@gmail.com";
const a = "CoderSchool Mentors";

const signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  algorithm: "RS256",
};

module.exports = { signOptions };
