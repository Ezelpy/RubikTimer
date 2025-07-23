from django.shortcuts import render
from django.http import JsonResponse
import subprocess

def index(request):
        return render(request, "rtimer/index.html")