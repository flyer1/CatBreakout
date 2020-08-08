import { Injectable } from '@angular/core';

import { School } from '../models/school.model';
import { Class } from '../models/class.model';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class SchoolService {

    school: School;

    ////////////////////////////////////////////////////////////

    init(): School {
        this.createSchool();
        console.log(this.school);
        return this.school;
    }

    createSchool() {
        this.school = { name: 'Sage Creek', classes: [] };

        const totalClasses = 20;
        const classSize = 24;

        for (let i = 0; i < totalClasses; i++) {
            this.school.classes.push(this.createClass(i, classSize));
        }
    }

    createClass(index: number, classSize: number): Class {

        const newClass: Class = {
            name: index + '',
            teacher: '',
            grade: '',
            students: []
        };

        for (let i = 0; i < classSize; i++) {
            newClass.students.push(this.createStudent());
        }

        return newClass;
    }

    createStudent(): Student {
        const newStudent: Student = {
            name: 'jon',
            relationships: []
        };

        return newStudent;
    }
}
