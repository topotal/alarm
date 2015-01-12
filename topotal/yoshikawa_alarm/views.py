from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from yoshikawa_alarm.models import Schedule
from django.utils import timezone
import datetime
import pytz
from datetime import timedelta

# Create your views here.


def hello(request):
    hour = request.GET["hour"]
    minute = request.GET["minute"]

#    now = datetime.datetime.now()
#    hour = now.hour
#    minute = now.minute

    if Schedule.is_exists(hour=hour, minute=minute):
        return HttpResponse("duplicate schedule")
    else:
        Schedule.set_alarm(hour, minute)
        return HttpResponse("OK")

    return HttpResponse("Unknown Error")
