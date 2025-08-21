from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Solve(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="solves"
    )
    time = models.FloatField()
    scramble = models.CharField(max_length=64)
    averageFive = models.FloatField()
