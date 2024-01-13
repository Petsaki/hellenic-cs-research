import { Router } from 'express';
import { getPublications, getPublicationsYearsRange } from '../controllers/publications.controller';

const router = Router();
// NOT IN USE
router.get('/', getPublications);
router.get('/yearsRange', getPublicationsYearsRange);

export default router;