import { Injectable } from '@angular/core';

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
        this.createVariousRelationships();
        console.log(this.school, this.flattenedStudents);
        return this.school;
    }

    // #region CREATE SCHOOL 
    createSchool() {
        const totalCohorts = 7;
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

        // Go for 3 groups of classes per cohort *gulp*
        for (let i = 0; i < 3; i++) {
            newCohort.classes.push(this.createClass(i, grade));
        }

        this.school.totalCohorts++;
        return newCohort;
    }

    createClass(index: number, grade: string): Class {
        const classSize = getRandom(24, 30);
        const instance = index + 1;
        const teachers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const teacher = teachers[index % teachers.length];

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
            name: index + '',
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
    createVariousRelationships() {
        this.createStudentRelationships(RelationshipType.sibling, getRandom(50, 100));
        this.createStudentRelationships(RelationshipType.daycare, getRandom(40, 60));
        this.createStudentRelationships(RelationshipType.extraCurricular, getRandom(30, 40));
        this.createStudentRelationships(RelationshipType.friend, getRandom(10, 20));
    }

    createStudentRelationships(count: number, type: RelationshipType) {
        for (let i = 0; i < count; i++) {
            this.createStudentRelationship(type);
        }
    }

    createStudentRelationship(type: RelationshipType) {

        switch (type) {
            case RelationshipType.sibling:
                const siblingIds = this.getRandomSiblings();
                const sibling1 = this.findStudent(siblingIds.sibling1);
                const sibling2 = this.findStudent(siblingIds.sibling2);

                sibling1.relationships.push({ type: RelationshipType.sibling, with: sibling2 });
                sibling2.relationships.push({ type: RelationshipType.sibling, with: sibling1 });
                break;
        }

    }

    getRandomSiblings(): { sibling1: number; sibling2: number; } {
        const sibling1 = this.getRandomStudentId();
        let sibling2 = this.getRandomStudentId();

        do {
            sibling2 = this.getRandomStudentId();
        } while (sibling1 === sibling2)

        return { sibling1, sibling2 };
    }

    getRandomStudentId() {
        return getRandom(0, this.nextStudentId);
    }

    findStudent(studentId: number) {
        return this.flattenedStudents.find(student => student.id === studentId);
    }

    //#endregion
}
