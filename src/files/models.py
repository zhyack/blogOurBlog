from django.db import models

# Create your models here.

class myFile(models.Model):
    fname = models.CharField(
        max_length=100,
        help_text='Required. 100 characters or fewer.',
    )

    fowner = models.CharField(
        max_length=200,
        help_text='Required. 200 characters or fewer.',
        default='admin',
    )

    fviewers = models.CharField(
        max_length=200,
        help_text='Required. 200 characters or fewer. Use `public` for all users.',
        default='private',
    )
    ftags = models.CharField(
        max_length=200,
        default='',
    )
    ffeature = models.CharField(
        max_length=20,
        default='default',
    )
    fdate = models.CharField(
        max_length=8,
    )
    furl = models.CharField(
        max_length=300,
        primary_key=True,
    )
    fpass = models.CharField(
        max_length=100,
        default='',
        blank=True
    )
    frank = models.IntegerField(
        default=0,
    )
    ftrace = models.IntegerField(
        default=1
    )
