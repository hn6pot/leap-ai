// Words the public page must never contain: people's names and an employer's name.
// They are kept encoded so that this public repository does not spell them out itself.
const WORDS = ["YsOpcmVuZ2Vy", "b3VhZGk=", "d29vY2xhcA=="].map((encoded) => Buffer.from(encoded, "base64").toString("utf8"));

export const FORBIDDEN = new RegExp(WORDS.join("|"), "i");
