from django import forms

class PostInfoForm(forms.Form):
    powner = forms.CharField(max_length=200)
    pname = forms.CharField(max_length=200)
    pviewers = forms.CharField(max_length=200)
    peditors = forms.CharField(max_length=200)
    ptags = forms.CharField(max_length=200)
    pfeature = forms.CharField(max_length=20)
    pcontent = forms.CharField(max_length=65535, required=False)
    poverlap = forms.BooleanField(required=False)
    ppass = forms.CharField(max_length=100, required=False)
    prank = forms.IntegerField()
    ptrace = forms.IntegerField()
