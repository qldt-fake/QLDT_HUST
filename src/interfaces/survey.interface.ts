import { surveyStatus } from "src/common/enum/commom";

export interface ISurveyPayload {
    file?:  any;
    title?: string | null;
    description?: string | null;
    deadline?: string | Date | null;
    classId?: string | null;
    token?: string;
    assignmentId?: string;
    file_url?: string;
    id?: string;
}

export interface ISubSurveyPayload {
    token?: string;
    class_id?: string;
    survey_id?: string;
    type? : surveyStatus | null;
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

export interface IEditSurveyProps {
    file_url?: string;
    title?: string;
    description?: string;
    deadline?: Date | string;
    id?: string;
}

