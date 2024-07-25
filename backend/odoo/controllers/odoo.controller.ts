import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { OdooService } from '../services/odoo.service';

@Controller('odoo')
export class OdooController {
    constructor(private readonly odooService: OdooService) {}

    @Post(':model')
    async create(
        @Param('model') model: string,
        @Body() data: any,
    ): Promise<unknown> {
        return this.odooService.create(model, data);
    }

    @Get(':model')
    async read(
        @Param('model') model: string,
        @Body() body: any,
    ): Promise<unknown> {
        const { domain, fields } = body;
        return this.odooService.read(model, domain, fields);
    }

    @Put(':model/:id')
    async update(
        @Param('model') model: string,
        @Param('id') id: number,
        @Body() data: any,
    ): Promise<unknown> {
        return this.odooService.update(model, id, data);
    }

    @Delete(':model/:id')
    async delete(
        @Param('model') model: string,
        @Param('id') id: number,
    ): Promise<unknown> {
        return this.odooService.delete(model, id);
    }
}
