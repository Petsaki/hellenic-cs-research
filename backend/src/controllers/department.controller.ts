import { Request } from 'express';
import { sendResponse } from '../api/common';
import Departments from '../models/department.model';
import { departmentsModel, omeaCitationsRes, omeaCitationsReqQuery } from '../types';
import { tryCatch } from '../utils/tryCatch';

// I can put type on getDepartments if i return the res.json but is useless because express and my custom types already checks what i am going to return
export const getDepartments = tryCatch(async (req: Request, res: omeaCitationsRes<departmentsModel[]>) => {
    const deparmentsList = await Departments.findAll();
    res.json(sendResponse<departmentsModel[]>(200, 'All good.', deparmentsList));
});

export const getDepartment = tryCatch(async (req: omeaCitationsReqQuery<{id:string}, {test: string, test2: string}>, res: omeaCitationsRes<departmentsModel>) => {
    const {id} = req.params;
    const {test, test2} = req.query;
    console.log(test);
    console.log(test2);
    
    // const department = await Departments.findByPk(id,{rejectOnEmpty: true});
    const department = await Departments.findByPk(id);
    if (!department) {
        throw new Error(`Deparment with this id: ${id}, does not exists.`);
    }

    return res.json(sendResponse<departmentsModel>(200,'All good.', department));
});