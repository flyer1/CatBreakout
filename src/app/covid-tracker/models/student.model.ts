export interface Student {
    id: number;
    name: string;
    relationships: StudentRelationship[];
    status: StudentStatus;
    statusDate: Date;
}

export interface StudentRelationship {
    type: RelationshipType;
    with: Student;
}

export enum StudentStatus {
    normal = 1,
    positive = 2
}

export enum RelationshipType {
    sibling = 1,
    daycare = 2,
    /** Sports/dance/etc */
    extraCurricular = 3,
    /** Peer that the child sees regularly outside of school, who is from another class */
    friend = 4
}
