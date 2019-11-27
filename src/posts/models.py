from django.db import models

# Create your models here.

class myPost(models.Model):
    pname = models.CharField(
        max_length=100,
        help_text='Required. 100 characters or fewer.',
    )
    powner = models.CharField(
        max_length=200,
        help_text='Required. 200 characters or fewer.',
        default='admin',
    )
    pviewers = models.CharField(
        max_length=200,
        help_text='Required. 200 characters or fewer. Use `public` for all users.',
        default='private',
    )
    peditors = models.CharField(
        max_length=200,
        help_text='Required. 200 characters or fewer. Use `public` for all users.',
        default='private',
    )
    ptags = models.CharField(
        max_length=200,
        default='',
    )
    pdate = models.CharField(
        max_length=8,
    )
    pfeature = models.CharField(
        max_length=20,
        default='default',
    )
    purl = models.CharField(
        max_length=300,
        primary_key=True,
    )
    ppass = models.CharField(
        max_length=100,
        default='',
        blank=True
    )
    prank = models.IntegerField(
        default=0,
    )
    ptrace = models.IntegerField(
        default=1
    )
