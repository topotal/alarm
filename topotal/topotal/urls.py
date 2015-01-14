from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'topotal.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       url(r'^admin/', include(admin.site.urls)),
                       )

urlpatterns += patterns('yoshikawa_alarm.views',
                        url(r'^register/', 'register'),
                        url(r'^stop/', 'stop'),
                        )
