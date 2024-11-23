export interface ISurveyPayload {
    file?:  any;
    title?: string | null;
    description?: string | null;
    deadline?: string | Date | null;
    classId?: string | null;
    token?: string;
    assignmentId?: string;
}

export interface ISubSurveyPayload {
    token?: string;
    class_id?: string;
    survey_id?: string;
}

export interface ISubmitSurveyPayload {
    file? : any;
    token?: string;
    assignmentId?: string;
    textResponse?: string | null;
}

export interface ISubmitSurveyProps {
    file_url?: string;
    title?: string;
    description?: string;
    deadline?: string;
    id?: string;
}
