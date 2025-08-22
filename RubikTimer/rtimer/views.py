from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import subprocess
from django.db import IntegrityError
from .models import Solve
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings

def index(request):
        if request.user.is_authenticated:
            if request.method == "POST":
                Solve.objects.create(
                    user=request.user,
                    time=request.POST["time"],
                    scramble=request.POST["scramble"],
                    averageFive=20.0
                )
                return HttpResponseRedirect(reverse("index"))

            solves = request.user.solves.order_by("-id")
            firstId = None
            if solves:
                firstId = solves.first().id
            return render(request, "rtimer/index.html", {
                    "solves": solves,
                    "firstId": firstId
            })
        else:
            return render(request, "rtimer/index.html") 

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "rtimer/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "rtimer/login.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "rtimer/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        User = get_user_model()
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "rtimer/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "rtimer/register.html")