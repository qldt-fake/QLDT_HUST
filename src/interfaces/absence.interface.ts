export interface AbsenceRequestProps {
    title?: string | null;
    file?: any;
    date?: string | Date | null;
    reason?: string | null;
    classId?: string | null;
  }

  export interface IAbsencePayload {
    file?:  any;
    title?: string | null;
    reason?: string | null;
    date?: string | Date | null;
    classId?: string | null;
    token?: string;
}