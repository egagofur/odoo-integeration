import { Controller, Logger, Post } from '@nestjs/common';

@Controller('notifications')
export class NotificationTestController {
    private readonly logger = new Logger(NotificationTestController.name);

    @Post('send')
    async sendNotification(): Promise<any> {
        console.log('Trigger Notification form odoo');
        return {
            data: {},
            message: 'Success Send Notification',
            meta: null,
        };
    }
}
