from __future__ import absolute_import

import os

from celery import Celery

from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'topotal.settings')

app = Celery('yoshikawa_alarm')

app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

#app.conf.update(
#    CELERY_IMPORTS=("yoshikawa_alarm.tasks", )
#)

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
