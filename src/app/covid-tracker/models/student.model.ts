export interface Student {
    name: string;
    relationships: StudentRelationship[];
}

export interface StudentRelationship {
    type: string;
    with: Student;
}
