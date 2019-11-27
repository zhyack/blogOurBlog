from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import User

class RegisterForm(UserCreationForm):
    profile = forms.CharField(max_length=300)
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "profile")
