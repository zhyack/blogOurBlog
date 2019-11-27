from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    comment = models.CharField(max_length=100, blank=True)
    proflle = models.CharField(max_length=300, default="/static/main/images/anony.png")


    class Meta(AbstractUser.Meta):
        pass
