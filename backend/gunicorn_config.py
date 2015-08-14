command = '/root/.virtualenvs/alarm/bin/gunicorn'
pythonpath = '/opt/alarm/backend'
bind = '0.0.0.0:5000'
workers = 1
user = 'root'
loglevel = 'info'
errorlog = '/var/log/error.log'
accesslog = '/var/log/access.log'
