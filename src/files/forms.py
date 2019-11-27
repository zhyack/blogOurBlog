from django import forms

class UploadForm(forms.Form):
    fviewers = forms.CharField(max_length=200)
    ufile = forms.FileField(required=False, widget=forms.ClearableFileInput(attrs={'multiple': True}))
    fname = forms.CharField(max_length=200, required=False)
    ftags = forms.CharField(max_length=200)
    ffeature = forms.CharField(max_length=20)
    foverlap = forms.BooleanField(required=False)
    fpass = forms.CharField(max_length=100, required=False)
    frank = forms.IntegerField()
    ftrace = forms.IntegerField()
