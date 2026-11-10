from django.shortcuts import render
from rest_framework import generics, permissions
from api.serializers import TodoSerializer, TodoToggleCompleteSerializer
from todo.models import Todo
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#5
from django.contrib.auth import authenticate
#6

class TodoListCreate(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    # 加入权限控制：只有登录用户才能访问
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user).order_by('-created_at')

    # 核心新增：在保存前自动把当前登录用户填入 user 字段
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)
class TodoToggleComplete(generics.UpdateAPIView):
    serializer_class = TodoToggleCompleteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)

    def perform_update(self, serializer):
        # 将当前的 completed 状态取反（True变False，False变True）
        serializer.instance.completed = not(serializer.instance.completed)
        serializer.save()
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            user = User.objects.create_user(username=data['username'], password=data['password'])
            user.save()
            token = Token.objects.create(user=user)
            # 注意：文档里写的是 data: {...} 会报错，必须写成 data={...}
            return JsonResponse(data={'token': str(token)}, status=201)
        except IntegrityError:
            return JsonResponse(data={'error': 'username taken. choose another username'}, status=400)
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = authenticate(
            request,
            username=data['username'],
            password=data['password']
        )
        if user is None:
            return JsonResponse(data={'error': 'unable to login. check username and password'}, status=400)
        else:
            # 返回用户 token
            try:
                token = Token.objects.get(user=user)
            except:
                # 如果在数据库中找不到 token，就新建一个
                token = Token.objects.create(user=user)
            return JsonResponse(data={'token': str(token)}, status=201)