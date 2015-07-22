# coding: utf-8
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound
from yoshikawa_alarm.models import Schedule
from django.utils import timezone
import datetime
import pytz
from datetime import timedelta
from django.core.cache import cache
from django.core import serializers
import json


# Create your views here.

def get_schedule(request):
    has_schdule = Schedule.is_exists()
    response = dict()
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


    response = dict()
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
    if int(request.POST["alarm_key"]) == cache.get("alarm_key"):
        cache.delete("alarm_key")
        response["message"] = "OK"
        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return HttpResponseNotFound('[{"message": "違いまっせ"}]', content_type='application/json')
