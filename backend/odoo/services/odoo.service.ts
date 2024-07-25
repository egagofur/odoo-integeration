import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OdooService {
    private readonly logger = new Logger(OdooService.name);

    private readonly url = 'http://localhost:8069';
    private readonly db = 'demo-odoo';
    private readonly username = 'admin@admin.com';
    private readonly password = 'admin';

    private async jsonRpcCall(
        method: string,
        params: Record<string, unknown>,
    ): Promise<unknown> {
        try {
            this.logger.debug(
                `Sending JSON-RPC call to ${
                    this.url
                } with params: ${JSON.stringify(params)}`,
            );
            const response = await axios.post(`${this.url}/jsonrpc`, {
                jsonrpc: '2.0',
                method,
                params,
                id: new Date().getTime(),
            });

            this.logger.debug(
                `Received response: ${JSON.stringify(response.data)}`,
            );
            if (response.data.error) {
                this.logger.error(
                    `Odoo JSON-RPC Error: ${JSON.stringify(
                        response.data.error,
                    )}`,
                );
                throw new HttpException(
                    response.data.error,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return response.data.result;
        } catch (error) {
            this.logger.error(`Error in JSON-RPC call: ${error.message}`);
            if (error.response) {
                this.logger.error(
                    `Response content: ${JSON.stringify(error.response.data)}`,
                );
            }
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async authenticate(): Promise<unknown> {
        type TParams = {
            service: string;
            method: string;
            args: string[];
        };
        const params: TParams = {
            service: 'common',
            method: 'login',
            args: [this.db, this.username, this.password],
        };
        return this.jsonRpcCall('call', params);
    }

    private async execute(
        model: string,
        method: string,
        args: any[],
    ): Promise<unknown> {
        const uid = await this.authenticate();
        const params = {
            service: 'object',
            method: 'execute_kw',
            args: [this.db, uid, this.password, model, method, args],
        };
        return this.jsonRpcCall('call', params);
    }

    async create(model: string, data: any): Promise<unknown> {
        this.logger.debug(
            `Creating new record in model ${model} with data: ${JSON.stringify(
                data,
            )}`,
        );
        return this.execute(model, 'create', [data]);
    }

    async read(model: string, domain: any, fields: any): Promise<unknown> {
        this.logger.debug(
            `Reading records from model ${model} with domain: ${JSON.stringify(
                domain,
            )} and fields: ${JSON.stringify(fields)}`,
        );
        return this.execute(model, 'search_read', [domain, { fields }]);
    }

    async update(model: string, id: number, data: any): Promise<unknown> {
        this.logger.debug(
            `Updating record in model ${model} with id: ${id} and data: ${JSON.stringify(
                data,
            )}`,
        );
        return this.execute(model, 'write', [[id], data]);
    }

    async delete(model: string, id: number): Promise<unknown> {
        this.logger.debug(`Deleting record in model ${model} with id: ${id}`);
        return this.execute(model, 'unlink', [[id]]);
    }
}
