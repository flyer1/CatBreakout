import { Cohort } from "./cohort.model";

export interface School {
    name: string;
    cohorts: Cohort[],
    totalCohorts: number;
    totalClasses: number;
    totalStudents: number;
}
