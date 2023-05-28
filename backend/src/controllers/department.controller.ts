import { Request } from 'express';
import { Sequelize } from 'sequelize';
import { sendResponse } from '../api/common';
import Departments from '../models/department.model';
import { departmentsModel, omeaCitationsRes, omeaCitationsReqQuery, omeaCitationsReqBody, IDepartments } from '../types';
import { checkFilter } from '../utils/checkFilter';
import { tryCatch } from '../utils/tryCatch';
import { Filter, FilterSchema } from '../types/request.types';


// I can put type on getDepartments if i return the res.json but is useless because express and my custom types already checks what i am going to return
export const getDepartments = tryCatch(async (req: omeaCitationsReqBody<Filter>, res: omeaCitationsRes<IDepartments[]>) => {
    // We have already checked the request body from getDepartmentsID middleware, this is useless now!
    // const {filter}: Filter = FilterSchema.parse(req.body);

    const {filter}: Filter = req.body;

    // CheckFilter does not need anymore because i am handling the error from zod!
    // checkFilter(req.body, filter);

    if (filter === 'id') {
        return res.json(sendResponse<IDepartments[]>(200, 'All good.', req.cache.departmentsID));
    }
    const deparmentsList = await getDepartmentsData(filter);
    
    return res.json(sendResponse<IDepartments[]>(200, 'All good.', deparmentsList));
});

export const getDepartment = tryCatch(async (req: omeaCitationsReqQuery<{id:string}, {test: string, test2: string}>, res: omeaCitationsRes<IDepartments>) => {
    const {id} = req.params;
    const {test, test2} = req.query;
    console.log(test);
    console.log(test2);
    
    // const department = await Departments.findByPk(id,{rejectOnEmpty: true});
    const department = await Departments.findByPk(id);
    if (!department) {
        throw new Error(`Deparment with this id: ${id}, does not exists.`);
    }

    return res.json(sendResponse<IDepartments>(200,'All good.', department));
});


// export const getDepartmentsStaff = tryCatch(async (req: omeaCitationsReqBody<DepartmentsReq>, res: omeaCitationsRes<IDepartments[]>) => {
//     const {departments}: DepartmentsReq = DepartmentsSchema.parse(req.body);
//     console.log(departments);

//     // if (departments) {
//     //     const deparmentsList = await Departments.findAll({
//     //         attributes: [
//     //             [Sequelize.fn('DISTINCT', Sequelize.col(filter)), filter]
//     //         ]
//     //     });
//     //     return res.json(sendResponse<departmentsModel[]>(200, 'All good.', deparmentsList));
//     // }
    
//     // const deparmentsList = await Departments.findAll();
//     // res.json(sendResponse<departmentsModel[]>(200, 'All good.', deparmentsList));
// });


export const getDepartmentsData = async (filter: string): Promise<IDepartments[]> => {
    if (filter) {
        return await Departments.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col(filter)), filter]
            ]
        });
    }
    
    return await Departments.findAll();
};