from __future__ import absolute_import

import datetime
from celery.task.base import periodic_task
from celery import shared_task
from yoshikawa_alarm.models import Schedule
from django.core.cache import cache
import pygame.mixer
import time
import random
import os


@periodic_task(run_every=datetime.timedelta(seconds=60))
def watch_schedule():
    now = datetime.datetime.now()
    weekday = now.weekday()
    has_schdule = Schedule.is_exists()
    if has_schdule:
        schedule = Schedule.objects.all().get()
        repeat_flg_list = []
        play_flg = False
#        target_schedule = None

        repeat_flg_list.append(schedule.repeat_monday)
        repeat_flg_list.append(schedule.repeat_tuesday)
        repeat_flg_list.append(schedule.repeat_wednesday)
        repeat_flg_list.append(schedule.repeat_thursday)
        repeat_flg_list.append(schedule.repeat_friday)
        repeat_flg_list.append(schedule.repeat_saturday)
        repeat_flg_list.append(schedule.repeat_sunday)

        has_repeat_flg = False
        for repeat_flg in repeat_flg_list:
            if repeat_flg:
                has_repeat_flg = True
                break

        if schedule.hour is now.hour and schedule.minute is now.minute:
            if has_repeat_flg:
                if repeat_flg_list[weekday]:
                    play_flg = True
            else:
                play_flg = True
#                target_schedule = schedule

        if play_flg:
            alarm_key = generate_alarm_key()
            print alarm_key
            cache.set('alarm_key', alarm_key["result"])
            start_music.delay()

            if not has_repeat_flg:
                schedule.delete()


@shared_task
def start_music():
    pygame.mixer.init()
    pygame.mixer.music.set_volume(0.5)
    base_dir = "yoshikawa_alarm/music"
    filename_list = ["lovelive.mp3", "warning.wav",
                     "critical.wav", "hostdown.wav", "sayonara_bus.mp3"]
    play_list = []

    for filename in filename_list:
        play_list.append(os.path.join(base_dir, filename))

    for music in play_list:
        pygame.mixer.music.load(music)
        pygame.mixer.music.play(-1)

        play_time = 0
        while is_sleeping() and play_time < 60:
            play_time += 1
            time.sleep(1)

        if is_sleeping():
            pygame.mixer.music.stop()
            continue
        else:
            break

    pygame.mixer.music.stop()
    pygame.mixer.quit()


def is_sleeping():
    return (cache.get('alarm_key') is not None)

def generate_random_number():
    source_string = '123456789'
    random_number = int("".join([random.choice(source_string) for x in xrange(2)]))
    return random_number



def generate_alarm_key():
    num1 = generate_random_number()
    num2 = generate_random_number()
    result = num1 * num2
    return {"num1": num1, "num2": num2, "result": result}
