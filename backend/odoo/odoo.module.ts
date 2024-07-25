import { Module } from '@nestjs/common';
import { OdooController } from './controllers/odoo.controller';
import { OdooService } from './services/odoo.service';

@Module({
    imports: [],
    controllers: [OdooController],
    providers: [OdooService],
})
export class OdooModule {}
