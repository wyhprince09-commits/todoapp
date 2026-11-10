from rest_framework import serializers
from todo.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    created_at = serializers.ReadOnlyField()
    completed = serializers.ReadOnlyField()

    class Meta:
        model = Todo
        fields = ['id', 'title', 'memo', 'created_at', 'completed']
        # 将数据库模型转化为json
class TodoToggleCompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id'] 
        # ⚠️ 注意：文档里写的是 'created'，但在你第一步建的模型里叫 'created_at'，必须写对
        read_only_fields = ['title', 'memo', 'created_at', 'completed'] 