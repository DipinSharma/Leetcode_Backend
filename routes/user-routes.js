import  express  from "express";
import { userController } from "../controllers/user-controller.js";

export const userRoutes=express.Router();
userRoutes.get('/profile/:username',userController.profile);
userRoutes.post('/login',userController.login);
userRoutes.post('/register',userController.register);
// userRoutes.put('/change-password',userController.changePassword)
// userRoutes.delete('/remove-account',userController.)
