import bcrypt from 'bcrypt';
export const hashing = {
    SALT: 10,
    passwordHash(plainPwd) {
        return bcrypt.hashSync(plainPwd, this.SALT);
    },
    matchPassword(plainPassword,dbPassword){
        return bcrypt.compareSync(plainPassword,dbPassword);
    }

}