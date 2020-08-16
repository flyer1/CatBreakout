import { Class } from "./class.model";

export interface Cohort {
    id: string;
    name: string;
    classes: Class[];
}