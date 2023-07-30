import { Router } from 'express';
import { getYearsRange } from '../controllers/years_range.controller';
import { getCacheYearsRange } from '../middlewares/getYearsRange';

const router = Router();

router.get('/', getCacheYearsRange, getYearsRange);

export default router;