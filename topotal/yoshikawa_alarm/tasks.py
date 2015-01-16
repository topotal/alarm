from __future__ import absolute_import

import datetime
from celery.task.base import periodic_task
from celery import shared_task
from yoshikawa_alarm.models import Schedule
from django.core.cache import cache
import pygame.mixer
import time
import redis
import random


@periodic_task(run_every=datetime.timedelta(seconds=60))
def watch_schedule():
    now = datetime.datetime.now()
    schedules = Schedule.objects.all()
    start_flg = False
    target_schedule = None
    for s in schedules:
        print "%s:%s %s:%s" % (s.hour, s.minute,
                               now.hour, now.minute)
        if s.hour is now.hour and s.minute is now.minute:
            start_flg = True
            target_schedule = s

    if start_flg:
        alarm_key = generate_alarm_key()
        print alarm_key
        cache.set('alarm_key', alarm_key)
        start_music.delay()
    if target_schedule and not target_schedule.weekly_flg:
        target_schedule.delete()


@shared_task
def start_music():
    pygame.mixer.init()
    pygame.mixer.music.set_volume(10.0)
    pygame.mixer.music.load("yoshikawa_alarm/static/lovelive.mp3")
    pygame.mixer.music.play()

    while cache.get('alarm_key'):
	time.sleep(1)

    pygame.mixer.music.stop()
    pygame.mixer.quit()


def generate_alarm_key():
    source_string = '123456789'
    key = "".join([random.choice(source_string) for x in xrange(4)])
    return int(key)
