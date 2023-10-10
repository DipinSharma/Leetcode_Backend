import { userModel } from "../db/models/user-schema.js";
import { hashing } from "../utils/encrypt.js";
export const userController = {
    async login(request, response) {
        try{
            const userInfo = request.body;
            const doc =await  userModel.findOne({ 'email': userInfo.email }).exec();
            if (doc && doc._id) {
                const dbPassword = doc.password;
                const plainPassword = userInfo.password;
                if (hashing.matchPassword(plainPassword, dbPassword)) {
                    response.json({ message: 'welcome ' + doc.name })
                }
                else {
                    response.json({ message: "Invalid useId or password" });
                }
            }
            else {
                response.json({ message: "Invalid useId or password" });
            }
        }
        catch(err){
            console.log("error in login",err);
            response.json({ message: "Invalid useId or password" });
        }
    },
    async register(request, response) {
        try {
            const userInfo = request.body;
            userInfo.password = hashing.passwordHash(userInfo.password);
            const doc = await userModel.create(userInfo);
            if (doc && doc._id) {
                response.json({ message: 'Register Successfully' })
            }
            else {
                response.json({ message: 'Problem in Register' })
            }
        }
        catch (err) {
            console.log("Register error", err);
            response.json({ message: 'Problem in Register' })
        }
    },
    profile(request, response) {
        const userName = request.params;
        response.json({ message: userName.username })
    },
    changePassword(request, response) {
        response.json({ message: 'Password' })
    }
}