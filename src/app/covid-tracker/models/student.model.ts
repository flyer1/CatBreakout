export interface Student {
    name: string;
    relationships: StudentRelationship[];
    status: StudentStatus;
    statusDate: Date;
}

export interface StudentRelationship {
    type: string;
    with: Student;
}

export enum StudentStatus {
    normal = 1,
    positive = 2
}
