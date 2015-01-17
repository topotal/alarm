# coding: utf-8
from django.db import models
from django.contrib import admin


class Schedule(models.Model):

    """Schedule is representations of schedule the alarm."""

    hour = models.IntegerField(verbose_name=u"時")
    minute = models.IntegerField(verbose_name=u"分")
    repeat_sunday = models.BooleanField(verbose_name=u"毎週日曜日", default=False)
    repeat_monday = models.BooleanField(verbose_name=u"毎週月曜日", default=False)
    repeat_tuesday = models.BooleanField(verbose_name=u"毎週火曜日", default=False)
    repeat_wednesday = models.BooleanField(verbose_name=u"毎週水曜日", default=False)
    repeat_thursday = models.BooleanField(verbose_name=u"毎週木曜日", default=False)
    repeat_friday = models.BooleanField(verbose_name=u"毎週金曜日", default=False)
    repeat_saturday = models.BooleanField(verbose_name=u"毎週土曜日", default=False)

    def __unicode__(self):
	return unicode(":".join([str(self.hour), str(self.minute)]))

    @classmethod
    def update_alarm(cls, hour, minute, repeat_sunday, repeat_monday, repeat_tuesday, repeat_wednesday, repeat_thursday, repeat_friday, repeat_saturday):
        obj = cls.objects.all().get()
        obj.hour = hour
        obj.minute = minute
        obj.repeat_sunday = repeat_sunday
        obj.repeat_monday = repeat_monday
        obj.repeat_tuesday = repeat_tuesday
        obj.repeat_wednesday = repeat_wednesday
        obj.repeat_thursday = repeat_thursday
        obj.repeat_friday = repeat_friday
        obj.repeat_saturday = repeat_saturday
        obj.save()
        return obj

    @classmethod
    def create_alarm(cls, hour, minute, repeat_sunday, repeat_monday, repeat_tuesday, repeat_wednesday, repeat_thursday, repeat_friday, repeat_saturday):
        obj = cls.objects.create(hour=hour, minute=minute,
                                 repeat_sunday=repeat_sunday,
                                 repeat_monday=repeat_monday,
                                 repeat_tuesday=repeat_tuesday,
                                 repeat_wednesday=repeat_wednesday,
                                 repeat_thursday=repeat_thursday,
                                 repeat_saturday=repeat_saturday
                                 )
	obj.save()
        return obj

    @classmethod
    def is_exists(cls):
        return cls.objects.all().exists()

admin.site.register(Schedule)
