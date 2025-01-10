from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import os
from django.http import HttpResponse


# Create your views here.
@login_required
def index(request):
    return render(request, 'frontend/index.html')

def js(request):
    with open("frontend/static/index.js", "r") as f:
        return HttpResponse(f.read(), content_type="application/javascript")
    