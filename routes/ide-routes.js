import express from 'express';
import { ideController } from '../controllers/ide-controller.js';
import { requireAuth } from '../middleware/requiredAuth.js';
export const ideRoutes=express.Router();
ideRoutes.get('/problems/:question',ideController.question);
ideRoutes.post('/addProblem',ideController.addProblem);
ideRoutes.get('/allProblems',ideController.allQuestions);
// ideRoutes.get('/ide/status',ideController.getStatus);
ideRoutes.post('/ide/submit',ideController.submit);

ideRoutes.use(requireAuth);
ideRoutes.post('/ide/compile',ideController.compile);
// ideRoutes.post('/questions')