import { Router } from 'express';
import { getPublications, getPublicationsYearsRange } from '../controllers/publications.controller';
import { getCacheYearsRange } from '../middlewares/getYearsRange';

const router = Router();

router.get('/', getPublications);
router.get('/yearsRange', getCacheYearsRange, getPublicationsYearsRange);

export default router;