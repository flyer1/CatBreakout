import { Cohort } from "./cohort.model";
import { SchoolOptions } from '../services/school.service';

export class School {
    name: string;
    cohorts: Cohort[];
    totalCohorts: number;
    totalClasses: number;
    totalStudents: number;

    static resetSchool(): SchoolOptions {
        return {
            totalStudents: 667,
            classSize: 25,
            cohortSize: 75,
            relationshipCounts: {
                daycare: 30,
                extraCurricular: 0,
                friend: 10,
                siblings: 0
            }
        };
    }
}
