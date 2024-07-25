import requests
import logging
from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class ProjectTask(models.Model):
    _inherit = 'project.task'

    @api.model
    def create(self, vals):
        record = super(ProjectTask, self).create(vals)
        self._send_webhook(record)
        return record

    def _send_webhook(self, record):
        url = "http://localhost:3000/api/v1/notifications/send"
        data = {
            "id": record.id,
            "name": record.name,
            "description": record.description,
        }
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()
            _logger.info('Webhook sent successfully, response: %s', response.text)
        except requests.exceptions.RequestException as err:
            _logger.error('Webhook failed: %s', err)
            if hasattr(err, 'response') and err.response is not None:
                _logger.error('Response content: %s', err.response.content)
