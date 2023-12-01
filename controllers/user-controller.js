import { userModel } from "../db/models/user-schema.js";
import { hashing } from "../utils/encrypt.js";
import validator from "validator";
import {createToken} from "../utils/JWT.js"

export const userController = {
    async login(request, response) {
        try {
            const userInfo = request.body;
            const doc = await userModel.findOne({ 'email': userInfo.email }).exec();
            if (!userInfo.email || !userInfo.password) {
                response.status(200).json({ message: "All fields Must be filled" });
                return;
            }
            if (doc && doc._id) {
                const dbPassword = doc.password;
                const plainPassword = userInfo.password;
                if (hashing.matchPassword(plainPassword, dbPassword)) {
                    const token=createToken(doc._id);
                    response.status(200).json({ message:"Signing In Successfully",username:doc.username ,token});
                }
                else {
                    response.status(200).json({ message: "Invalid useId or password" });
                }
            }
            else {
                response.status(200).json({ message: "Invalid useId or password" });
            }
        }
        catch (err) {
            console.log("error in login", err);
            response.status(200).json({ message: "Invalid useId or password" });
        }
    },
    async signIn(request, response) {
        try {
            const userInfo = request.body;

            // validation
            if (!userInfo.email || !userInfo.password) {
                response.status(200).json({ message: "All fields Must be filled" });
                return;
            }
            else if (!validator.isEmail(userInfo.email)) {
                response.status(200).json({ message: "Email is not valid" });
                return;
            }
            else if (!validator.isStrongPassword(userInfo.password)) {
                response.status(200).json({ message: "Password not strong enough" });
                return;
            }
            const check = await userModel.findOne({ 'username': userInfo.username }).exec();
            if (check) {
                response.status(200).json({ message: "username already exists" });
                return;
            }
            else {
                userInfo.password = hashing.passwordHash(userInfo.password);
                const doc = await userModel.create(userInfo);
                if (doc && doc._id) {
                    const token=createToken(doc._id);
                    response.status(200).json({username:userInfo.username, message: 'Signing In Successfully' ,token});
                    return;
                }
                else {
                    response.status(200).json({ message: 'Problem in Signing In' })
                    return;
                }

            }

        }

        catch (err) {
            console.log("Signing In error", err);
            response.status(200).json({ message: 'Problem in Signing In' })
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