import { Student } from "./student.model";

export interface Class {
    name: string;
    teacher: string;
    grade: string;
    students: Student[];
}