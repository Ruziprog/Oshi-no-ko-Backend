from .settings import *

# Используем тестовую БД
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='postgresql://postgres:postgres@localhost:5432/test_db',
        conn_max_age=600
    )
}

# Отключаем ненужное для тестов
DEBUG = False
SECRET_KEY = 'dummy-key-for-ci-only'

# Упрощаем статику для CI
STORAGES = {
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
}