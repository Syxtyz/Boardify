from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.
class Board(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    shared_with = models.ManyToManyField(User, related_name='shared_boards', blank=True)

    def __str__(self):
        return self.title
    
class List(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return F"{self.title} (Board: {self.board.title})"
    
class Card(models.Model):
    CARD_TYPE_CHOICES = [
        ('paragraph', 'Paragraph'),
        ('checkbox', 'Checkbox'),
    ]

    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=100)
    card_type = models.CharField(max_length=20, choices=CARD_TYPE_CHOICES, default='paragraph')
    description = models.TextField(blank=True)
    checkbox_items = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} [{self.card_type}] (List: {self.list.title})"