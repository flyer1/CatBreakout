import { Injectable } from '@angular/core';
import { name } from 'faker';

import { School } from '../models/school.model';
import { Class } from '../models/class.model';
import { Cohort } from '../models/cohort.model';
import { Student, StudentStatus, RelationshipType } from '../models/student.model';
import { padLeft, getRandom } from '../../core/helpers/common-helpers';

@Injectable({ providedIn: 'root' })
export class SchoolService {

    school: School;
    flattenedStudents: Student[];
    nextStudentId = 0;

    ////////////////////////////////////////////////////////////

    init(): School {
        this.createSchool();
        this.flattenStudents();
        this.createAllRelationships();
        console.log(this.school);

        return this.school;
    }

    // #region CREATE SCHOOL 
    createSchool() {
        const totalCohorts = 10;
        const grades = ['K', '1', '2', '3', '4', '5', '6'];

        this.school = {
            name: 'Sage Creek',
            cohorts: [],
            totalCohorts: 0,
            totalClasses: 0,
            totalStudents: 0
        };

        for (let i = 0; i < totalCohorts; i++) {
            let grade = grades[i];

            this.school.cohorts.push(this.createCohort(i, grade));
        }
    }

    createCohort(index: number, grade: string): Cohort {
        let newCohort: Cohort = {
            id: 'C' + index,
            name: 'Cohort-' + index,
            classes: []
        };

        for (let i = 0; i < 4; i++) {
            newCohort.classes.push(this.createClass(i, grade));
        }

        this.school.totalCohorts++;
        return newCohort;
    }

    createClass(index: number, grade: string): Class {
        const classSize = getRandom(15, 20);
        const instance = index + 1;
        const teacher = `${name.prefix()} ${name.firstName()} ${name.lastName()}`;

        const newClass: Class = {
            id: grade === 'K' ? '0-' + padLeft(instance, 2) : grade + '-' + padLeft(instance, 2),
            teacher: teacher,
            name: grade === 'K' ? 'K' + instance : 'G' + grade,
            grade: grade,
            gradeInstance: instance,
            students: []
        };

        for (let i = 0; i < classSize; i++) {
            newClass.students.push(this.createStudent(i));
        }

        this.school.totalClasses++;
        return newClass;
    }

    createStudent(index: number): Student {
        const newStudent: Student = {
            id: this.nextStudentId++,
            name: `${name.firstName()} ${name.lastName()}`,
            relationships: [],
            status: StudentStatus.normal,
            statusDate: null
        };

        this.school.totalStudents++;
        return newStudent;
    }

    //#endregion

    flattenStudents() {
        this.flattenedStudents = [];

        this.school.cohorts.forEach(cohort => {
            cohort.classes.forEach(c => {
                c.students.forEach(student => this.flattenedStudents.push(student));
            })
        })
    }

    // #region CREATE STUDENT RELATIONSHIPS

    // Generate random relationships between students of various types.
    createAllRelationships() {
        this.createStudentRelationships(RelationshipType.sibling, getRandom(50, 100));
        this.createStudentRelationships(RelationshipType.daycare, getRandom(20, 40));
        this.createStudentRelationships(RelationshipType.extraCurricular, getRandom(10, 20));
        this.createStudentRelationships(RelationshipType.friend, getRandom(10, 15));
    }

    createStudentRelationships(type: RelationshipType, count: number) {
        for (let i = 0; i < count; i++) {
            this.createStudentRelationship(type);
        }
    }

    createStudentRelationship(type: RelationshipType) {
        const students = this.getStudentPair();

        students.student1.relationships.push({ type: type, with: students.student2 });
        students.student2.relationships.push({ type: type, with: students.student1 });
    }

    getStudentPair(): { student1: Student; student2: Student; } {
        const student1 = this.getRandomStudentId();
        let student2 = this.getRandomStudentId();

        do {
            student2 = this.getRandomStudentId();
        } while (student1 === student2)

        return {
            student1: this.findStudent(student1),
            student2: this.findStudent(student2)
        };
    }

    getRandomStudentId() {
        return getRandom(0, this.nextStudentId - 1);
    }

    findStudent(studentId: number) {
        return this.flattenedStudents.find(student => student.id === studentId);
    }

    //#endregion
}
