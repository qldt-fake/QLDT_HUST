import { postMethodApi } from 'src/services/api';
import { MessageApi } from 'src/services/clientConstant';
import {IBodyResponse} from "src/interfaces/common.interface";


export interface IGetListConversationsBody {
    token: string;
    index: number;
    count: number;
}

export interface IConversation {
    id: number;
    partner: {
        id: number;
        name: string;
        avatar: string | null;
    };
    last_message: {
        sender: {
            id: number;
            name: string;
            avatar: string | null;
        };
        message: string;
        created_at: string;
        unread: number;
    };
    created_at: string;
    updated_at: string;
}
export interface IGetConversationsBody {
    token: string;
    index: number;
    count: number;
    conversation_id: string;
    mark_as_read: boolean;
}

export interface IMessageResponse {
    message_id: string;
    message: string;
    sender: {
        id: number;
        name: string;
        avatar: string | null;
    };
    created_at: string;
    unread: number;
}

export interface IGetConversationResponse {
    conversation: IMessageResponse[];
    is_blocked: string;
}
export const getListConversationsApi = async (
    data: IGetListConversationsBody
): Promise<IBodyResponse<any,any>> => {
    return postMethodApi(MessageApi.GET_LIST_CONVERSATIONS, data);
};
export const getConversationApi = async (
    data: IGetConversationsBody
): Promise<IBodyResponse<any, any>> => {
    return postMethodApi(MessageApi.GET_CONVERSATION, data);
};
