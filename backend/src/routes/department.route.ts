import { Router } from 'express';
import { getDepartment, getDepartments } from '../controllers/department.controller';

const router = Router();

router.get('/', getDepartments);
router.get('/:id', getDepartment);

export default router;