import bcrypt from "bcrypt"

export const hashPasswd = async (passwd) => {
    const saltRounds = 12;
    return await bcrypt.hash(passwd, saltRounds);
}

export const authPasswd = async (passwd, passwdHash) => {
    return await bcrypt.compare(passwd, passwdHash);
}   
