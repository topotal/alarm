from __future__ import absolute_import

import datetime
from celery.task.base import periodic_task
from celery import shared_task
from yoshikawa_alarm.models import Schedule
import mp3play
import time


@periodic_task(run_every=datetime.timedelta(seconds=15))
def watch_schedule():
    now = datetime.datetime.now()
    schedules = Schedule.objects.all()
    start_flg = False
    target_schedule = None
    for s in schedules:
        print "%s:%s %s:%s" % (s.hour, s.minute,
                               now.hour, now.minute)
        if s.hour is now.hour and s.minute is now.minute:
            print 'a'
            start_flg = True
            target_schedule = s

    if start_flg:
        print "start alarm"
        play_music.delay()
    if target_schedule and not target_schedule.weekly_flg:
        target_schedule.delete()


@shared_task
def play_music():
    filename = "../lovelive.mp3"
    mp3 = mp3play.load(filename)
    mp3.play()
    time.sleep(5)
    mp3.stop()
    print "end"