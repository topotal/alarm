command = '/root/.virtualenvs/yoshikawa_alarm/bin/gunicorn'
pythonpath = '/opt/yoshikawa_alarm/topotal'
bind = '0.0.0.0:5000'
workers = 1
user = 'root'
loglevel = 'info'
errorlog = '/var/log/error.log'
accesslog = '/var/log/access.log'