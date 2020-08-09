import { Class } from "./class.model";

export interface School {
    name: string;
    classes: Class[],
    totalClasses: number;
    totalStudents: number;
}
