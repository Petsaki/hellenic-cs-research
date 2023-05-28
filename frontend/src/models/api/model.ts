import { AlertColor } from '@mui/material/Alert/Alert';

export interface IAlert {
    message: string;
    type: AlertColor;
    duration?: number;
    isOpen?: boolean;
}

export type CompareByType = 'department' | 'academicStaff';
