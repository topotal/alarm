from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'topotal.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       url(r'^admin/', include(admin.site.urls)),
                       )

urlpatterns += patterns('alarm.views',
                        url(r'^schedule/', 'get_schedule'),
                        url(r'^set/', 'set'),
                        url(r'^stop/', 'stop'),
                        )
