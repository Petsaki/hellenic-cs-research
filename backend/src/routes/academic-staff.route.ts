import { Router } from 'express';
import { getPositions, getPositionsCountByDepartment } from '../controllers/academic-staff.controller';
import { getCacheAllPositions } from '../middlewares/getAllPositions';

const router = Router();

router.get('/positions', getCacheAllPositions, getPositions);
router.post('/positionsSumByDepartment', getCacheAllPositions, getPositionsCountByDepartment);

export default router;