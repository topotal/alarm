from __future__ import absolute_import

import datetime
from celery import shared_task
from celery.task.base import periodic_task


@shared_task
def add(x, y):
    return x + y


@periodic_task(run_every=datetime.timedelta(seconds=5))
def minus():
    return 1 * 4
