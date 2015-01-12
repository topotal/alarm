# coding: utf-8
from django.db import models


class Schedule(models.Model):

    """Schedule is representations of schedule the alarm."""

    hour = models.IntegerField(verbose_name=u"秒")
    minute = models.IntegerField(verbose_name=u"分")
    weekly_flg = models.BooleanField(verbose_name=u"毎週かどうか",
                                     default=False)

    @classmethod
    def set_alarm(cls, hour, minute):
        obj = cls.objects.create(hour=hour, minute=minute)
        obj.save()
        return obj

    @classmethod
    def is_exists(cls, hour, minute):
        return cls.objects.filter(hour=hour, minute=minute).exists()
