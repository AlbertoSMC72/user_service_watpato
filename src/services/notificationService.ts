interface NotificationPayload {
    followedId: number;
    title: string;
    body: string;
}

export class NotificationService {
    private static readonly NOTIFICATION_BASE_URL = process.env.NOTIFICATION_SERVICE_URL || 'https://notificationsservicewatpato-production.up.railway.app/api';

    static async sendNewFollowerNotification(followedId: number, followerUsername: string): Promise<void> {
        try {
            const payload: NotificationPayload = {
                followedId,
                title: '¡Tienes un nuevo seguidor!',
                body: `${followerUsername} ha comenzado a seguirte.`
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

            const response = await fetch(`${this.NOTIFICATION_BASE_URL}/notify/new-follower`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            console.log(`Notificación enviada exitosamente al usuario ${followedId}`);
        } catch (error) {
            console.error('Error al enviar notificación de nuevo seguidor:', error);
        }
    }
} 