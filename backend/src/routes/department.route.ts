import { Router } from 'express';
import { getDepartment, getDepartments } from '../controllers/department.controller';
import { getCacheDepartmentsID } from '../middlewares/getDepartmentsID';

const router = Router();

router.post('/',getCacheDepartmentsID, getDepartments);
router.get('/:id', getDepartment);

export default router;