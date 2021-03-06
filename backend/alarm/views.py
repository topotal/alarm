# coding: utf-8
from django.http import HttpResponse, HttpResponseNotFound
from alarm.models import Schedule
from django.core.cache import cache
from django.core import serializers
import json
import redis


# Create your views here.

def get_schedule(request):
    has_schdule = Schedule.is_exists()
    if has_schdule:
        schedule = Schedule.objects.all()
        _json = serializers.serialize('json', schedule, ensure_ascii=False)
        return HttpResponse(_json, content_type='application/json')
    else:
        return HttpResponse('[{"message": "None"}]', content_type='application/json')


def set(request):

    for key in request.POST:
        print key, request.POST[key]

    hour = int(request.POST["hour"])
    minute = int(request.POST["minute"])
    repeat_sunday = int(request.POST["repeat_sunday"])
    repeat_monday = int(request.POST["repeat_monday"])
    repeat_tuesday = int(request.POST["repeat_tuesday"])
    repeat_wednesday = int(request.POST["repeat_wednesday"])
    repeat_thursday = int(request.POST["repeat_thursday"])
    repeat_friday = int(request.POST["repeat_friday"])
    repeat_saturday = int(request.POST["repeat_saturday"])

    if Schedule.is_exists():
        Schedule.update_alarm(hour, minute, repeat_sunday, repeat_monday,
                              repeat_tuesday, repeat_wednesday, repeat_thursday,
                              repeat_friday, repeat_saturday)
        print hour, minute, repeat_sunday, repeat_monday
        return HttpResponse('[{"message": "OK"}]', content_type='application/json')
    else:
        Schedule.create_alarm(hour, minute, repeat_sunday, repeat_monday,
                              repeat_tuesday, repeat_wednesday, repeat_thursday,
                              repeat_friday, repeat_saturday)

        return HttpResponse('[{"message": "OK"}]', content_type='application/json')

    return HttpResponseNotFound('[{"message": "Page Not Found."}]', content_type='application/json')


def stop(request):
    response = dict()
    pool = redis.ConnectionPool(host='localhost', port=6379, db=1)
    r = redis.Redis(connection_pool=pool)
    if request.POST["alarm_key"] == r.hget("alarm_key", "result"):
        r.delete("alarm_key")
        response["message"] = "OK"
        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return HttpResponseNotFound('[{"message": "違いまっせ"}]', content_type='application/json')
