import express from 'express';
import { ideController } from '../controllers/ide-controller.js';
export const ideRoutes=express.Router();
ideRoutes.post('/ide/compile',ideController.compile);
ideRoutes.post('/ide/submit',ideController.submit);
ideRoutes.get('/ide/status',ideController.getStatus);
ideRoutes.get('/problems/:question',ideController.question);
ideRoutes.post('/addProblem',ideController.addProblem);
// ideRoutes.post('/questions')