import { Injectable } from '@angular/core';

import { School } from '../models/school.model';
import { Class } from '../models/class.model';
import { Student, StudentStatus } from '../models/student.model';
import { compare, padLeft, getRandom } from '../../core/helpers/common-helpers';

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
        const totalClasses = getRandom(18, 23);
        const grades = ['K', '1', '2', '3', '4', '5', '6'];
        const teachers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let gradeCounter: { [grade: string]: number } = {};

        this.school = {
            name: 'Sage Creek',
            classes: [], 
            totalClasses: totalClasses,
            totalStudents: 0
        };

        for (let i = 0; i < totalClasses; i++) { 
            const gradeIndex = i % grades.length;
            let grade = grades[gradeIndex];
 
            if (gradeCounter[grade]) {
                gradeCounter[grade]++;
            } else {
                gradeCounter[grade] = 1;
            }

            this.school.classes.push(this.createClass(gradeCounter[grade], grade));
        }

        // We didn't know how many instances of the same grade that would be generated. Now that this is calculated, sort to group them together.
        this.school.classes = this.school.classes.sort((a, b) => compare(a.id, b.id, true))

        for (let i = 0; i < totalClasses; i++) {
            this.school.classes[i].teacher = teachers[i % teachers.length];
            this.school.totalStudents += this.school.classes[i].students.length;
        }
    }

    createClass(index: number, grade: string): Class {
        const classSize = getRandom(24,30);

        const newClass: Class = {
            id: grade === 'K' ? '0-' + padLeft(index, 2) : grade + '-' + padLeft(index, 2),
            name: grade,
            teacher: null,
            grade: grade === 'K' ? 'K' + index : 'G' + grade,
            gradeInstance: index,
            students: []
        };

        for (let i = 0; i < classSize; i++) {
            newClass.students.push(this.createStudent(i));
        }

        return newClass;
    }

    createStudent(index: number): Student {
        const newStudent: Student = {
            name: index + '',
            relationships: [],
            status: StudentStatus.normal,
            statusDate: null
        };

        return newStudent;
    }
}
