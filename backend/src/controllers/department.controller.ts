import { Request, Response } from 'express';
import Departments from '../models/department.model';

export const getDepartments = async (req: Request, res: Response): Promise<void> => {
    const listDeparments = await Departments.findAll();
    res.json(listDeparments);
}

export const getDepartment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {test, test2} = req.query;
    const department = await Departments.findByPk(id);
    if (department) {
        res.json(department);
    } else {
        res.status(404).json({
            msg: `Not exists department with this id: ${id}`
        });
    }
}