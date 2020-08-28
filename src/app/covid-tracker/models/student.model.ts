import { HierarchyCircularNode } from 'd3-hierarchy';

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
    studentNode?: any;
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

/** The data structure that is used to render the relationships between students */
export interface StudentRelationshipNode {
    id: number;
    from: HierarchyCircularNode<any>;
    to: HierarchyCircularNode<any>;
}

