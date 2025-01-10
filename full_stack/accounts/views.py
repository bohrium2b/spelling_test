from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout

# Create your views here.
def login(request):
    if request.method == 'POST':
        # Handle the form submission
        username = request.POST['username']
        password = request.POST['password']
        # Authenticate the user
        user = User.objects.filter(username=username).first()
        if user is None:
            return render(request, 'auth/login.html', {
                'error': 'Username or password is incorrect'
            })
        
        # Log the user in
        user = authenticate(username=username, password=password)
        if user is None:
            return render(request, 'auth/login.html', {
                'error': 'Username or password is incorrect'
            })
        auth_login(request, user)

        return redirect('/')
    return render(request, 'auth/login.html')


def logout(request):
    # Log the user out
    auth_logout(request)
    return redirect('/accounts/login/')

def register(request):
    if request.method == 'POST':
        # Handle the form submission
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password_confirm = request.POST['password_confirm']
        if password != password_confirm:
            return render(request, 'auth/register.html', {
                'error': 'Passwords do not match'
            })
        # Create the user
        user = User.objects.create_user(username, email, password)
        user.save()
        return render(request, 'auth/login.html', {
            'message': 'User created successfully'
        })
    return render(request, 'auth/register.html')
