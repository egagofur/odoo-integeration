import { Module } from '@nestjs/common';
import { NotificationTestController } from './controllers/notification-test.controller';

@Module({
    controllers: [NotificationTestController],
    providers: [],
    imports: [],
    exports: [],
})
export class NotificationTestModule {}
