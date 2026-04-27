# straw_prod/tasks.py
from celery import shared_task

@shared_task
def test_task():
    print("Celery работает!")
    return "Done"