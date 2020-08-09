import { Student } from "./student.model";

export interface Class {
    id: string;
    name: string;
    teacher: string;
    grade: string;
    gradeInstance: number;
    students: Student[];
}