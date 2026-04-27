import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshi_no_ko.settings')

app = Celery('oshi_no_ko')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()