import { NotificationType } from 'src/common/enum/commom';

export interface INotification {
  id: string;
  description: string;
  time: string;
  type: NotificationType;
  ownerUri?: string;
  isLook: boolean;
}
