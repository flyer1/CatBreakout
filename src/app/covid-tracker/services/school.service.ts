import { Injectable } from '@angular/core';
import { name } from 'faker';

import { School } from '../models/school.model';
import { Class } from '../models/class.model';
import { Cohort } from '../models/cohort.model';
import { Student, StudentStatus, RelationshipType } from '../models/student.model';
import { padLeft, getRandom, compare } from '../../core/helpers/common-helpers';
import { CookieStorageService, CookieStorageKeys } from 'src/app/core/storage/cookie-storage.service';

@Injectable({ providedIn: 'root' })
export class SchoolService {

    school: School;
    flattenedStudents: Student[];
    nextStudentId = 0;

    ////////////////////////////////////////////////////////////
    constructor(private cookieStorageService: CookieStorageService) { }

    init(options?: SchoolOptions): School {
        options = options ?? School.resetSchool();
        
        // this.player = this.cookieStorageService.get(CookieStorageKeys.SCHOOL_STATE) || Player.resetPlayer();
        // this.cookieStorageService.set({ name: CookieStorageKeys.SCHOOL_STATE, value: , session: true });

        this.createSchool(options);
        this.flattenStudents();
        this.createAllRelationships(options);
        console.log(this.school);

        return this.school;
    }

    // #region CREATE SCHOOL 
    createSchool(options: SchoolOptions) {
        this.school = {
            name: 'Sage Creek',
            cohorts: [],
            totalCohorts: 0,
            totalClasses: 0,
            totalStudents: 0
        };

        const students: Student[] = [];
        for (let i = 0; i < options.totalStudents; i++) {
            students.push(this.createStudent(i));
        }

        const classes: Class[] = [];
        const grades = ['K', '1', '2', '3', '4', '5', '6'];
        const classCount = Math.ceil(options.totalStudents / options.classSize);
        for (let i = 0; i < classCount; i++) {
            let grade = grades[i % grades.length];
            classes.push(this.createClass(i, grade));
        }
        // Sort the classes
        classes.sort((a, b) => compare(a.id, b.id, true))

        // Use a round robin approach to assigning students to the collection of available classes
        for (let i = 0; i < students.length; i++) {
            const c = classes[i % classes.length];
            c.students.push(students[i]);
        }

        const cohortCount = Math.ceil(options.totalStudents / options.cohortSize);
        const cohorts: Cohort[] = [];
        for (let i = 0; i < cohortCount; i++) {
            cohorts.push(this.createCohort(i, 'xxx'));
        }

        // Use a round robin approach to assigning classes to the collection of available cohorts
        for (let i = 0; i < classes.length; i++) {
            const cohort = cohorts[i % cohorts.length];
            cohort.classes.push(classes[i]);
        }

        this.school.cohorts = cohorts;
    }

    createCohort(index: number, grade: string): Cohort {
        let newCohort: Cohort = {
            id: 'C' + index,
            name: 'Cohort-' + index,
            classes: []
        };

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
    createAllRelationships(options: SchoolOptions) {
        this.createStudentRelationships(RelationshipType.sibling, options.relationshipCounts.siblings);
        this.createStudentRelationships(RelationshipType.daycare, options.relationshipCounts.daycare);
        this.createStudentRelationships(RelationshipType.extraCurricular, options.relationshipCounts.extraCurricular);
        this.createStudentRelationships(RelationshipType.friend, options.relationshipCounts.friend);
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

export class SchoolOptions {

    totalStudents: number;
    cohortSize: number;
    classSize: number;

    relationshipCounts: {
        siblings: number;
        daycare: number;
        extraCurricular: number;
        friend: number;
    }
}