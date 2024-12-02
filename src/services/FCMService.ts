import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { EventEmitter } from 'eventemitter3';
import notifee from '@notifee/react-native';

interface NotificationData {
    notification?: FirebaseMessagingTypes.Notification;
    data?: FirebaseMessagingTypes.RemoteMessage['data'];
}

// Tạo một lớp singleton để xử lý FCM
class FCMService {
    private static instance: FCMService | null = null;
    private eventEmitter: EventEmitter;
    private static token: string;
    public static getToken(): string {
        return this.token;
    }

    private constructor() {
        this.eventEmitter = new EventEmitter();
        this.initializeFCM();
        console.log("FCMService initialized successfully");
    }

    public static getInstance(): FCMService {
        if (!FCMService.instance) {
            FCMService.instance = new FCMService();
        }
        return FCMService.instance;
    }

    private async initializeFCM(): Promise<void> {
        await this.getFCMToken();
        this.handleForegroundNotifications();
        this.handleBackgroundNotifications();
        await this.createNotificationChannel();
    }

    private async getFCMToken(): Promise<void> {
        try {
            FCMService.token = await messaging().getToken();
            console.log('FCM Token:', FCMService.token);
        } catch (error) {
            console.error('Error fetching FCM token:', error);
        }
    }

    private async createNotificationChannel(): Promise<void> {

        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });
    }
    private handleForegroundNotifications(): void {
        messaging().onMessage(async (remoteMessage) => {
            console.log('Foreground Notification:', remoteMessage);

            const { notification, data } = remoteMessage;


            await notifee.displayNotification({
                title: notification?.title || 'New Notification',
                body: notification?.body || '',
                android: {
                    channelId: 'default',
                },
            });

            this.eventEmitter.emit('newNotification', { notification, data });
        });
    }

    private handleBackgroundNotifications(): void {
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Background Notification:', remoteMessage);
            const { notification, data } = remoteMessage;


            await notifee.displayNotification({
                title: notification?.title || 'New Notification',
                body: notification?.body || '',
                android: {
                    channelId: 'default',
                },
            });

            this.eventEmitter.emit('newNotification', { notification, data });
        });
    }

    public on(event: 'newNotification', listener: (data:any) => void): void {
        this.eventEmitter.on(event, listener);
    }

    public off(event: 'newNotification', listener: (data: any) => void): void {
        this.eventEmitter.off(event, listener);
    }
}

export default FCMService;