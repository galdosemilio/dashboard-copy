import { SequenceAssociation } from './sequenceAssociation';

export interface SequenceEntity {
    /** Sequence Asssociation options */
    association: SequenceAssociation;
    /** Sequence ID */
    id: string;
    /** Sequence name */
    name: string;
}
