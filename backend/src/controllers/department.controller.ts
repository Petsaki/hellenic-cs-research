import { Request, Response } from 'express';
import { sendResponse } from '../api/common';
import Departments from '../models/department.model';
import { departmentsModel, omeaCitationsRes, omeaCitationsReqQuery } from '../types';

// I can put type on getDepartments if i return the res.json but is useless because express and my custom types already checks what i am going to return
export const getDepartments = async (req: Request, res: omeaCitationsRes<departmentsModel[]>) => {
    const listDeparments = await Departments.findAll();
    res.json(sendResponse<departmentsModel[]>(200,'All good.',true,listDeparments));
}

export const getDepartment = async (req: omeaCitationsReqQuery<{id:string},{test:string,test2:string}>, res: omeaCitationsRes<departmentsModel>) => {
    const {id} = req.params;
    const {test, test2} = req.query;
    console.log(test);
    console.log(test2);
    
    // const department = await Departments.findByPk(id,{rejectOnEmpty: true});
    const department = await Departments.findByPk(id);
    
    if (department) {
        // TODO: A table/enum/switch that will check the code and base of that will set success true or false!
        // Maybe i can do the same for description
        res.json(sendResponse<departmentsModel>(200,'All good.',true,department));
    } else {
        res.json(sendResponse<departmentsModel>(404,`Deparment with this id: ${id}, does not exists.`,false));
    }
}