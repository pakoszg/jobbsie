import express from 'express';
import getJob from './getJob';
import { authenticateToken, requireEmployer } from '../../middleware/auth';
import getEmployerJobs from './getEmployerJobs';
import createJob from './createJob';
import updateJob from './updateJob';
import removeJob from './removeJob';

const jobsRouter = express.Router();

// Protected routes
jobsRouter.use(authenticateToken);

// Applicant-only routes
jobsRouter.get('/applicant/:id', getJob);

// Employer-only routes
jobsRouter.use(requireEmployer);
jobsRouter.get('/employer', getEmployerJobs);
jobsRouter.post('/', createJob);
jobsRouter.put('/:id', updateJob);
jobsRouter.post('/remove/:id', removeJob);

export default jobsRouter;
