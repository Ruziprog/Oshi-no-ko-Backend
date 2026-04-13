from django.db import models

class Person(models.Model):
    class Gender(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'

    name = models.CharField(max_length=100, unique=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=Gender.choices)
    debut_date = models.DateField()
    agency = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    biography = models.TextField(blank=True, null=True)
    followers = models.IntegerField(default=0, null=True)
    popularity_rank = models.IntegerField(default=0, blank=True, null=True)

    class Status(models.TextChoices):
        ACTIVE = 'A', 'Active'
        INACTIVE = 'I', 'Inactive'

    status = models.CharField(max_length=1, choices=Status.choices, default=Status.ACTIVE)
    class TalentType(models.TextChoices):
        IDOL = 'idol', 'Idol'
        ACTOR = 'actor', 'Actor'
    talent_type = models.CharField(max_length=50, choices=TalentType.choices, default=TalentType.IDOL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name'] 
        verbose_name = 'Person'
        verbose_name_plural = 'People'


    def __str__(self):
        return self.name
    