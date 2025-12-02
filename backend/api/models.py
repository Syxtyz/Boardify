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
    
class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('board_created', 'Board Created'),
        ('board_updated', 'Board Updated'),
        ('board_shared', 'Board Shared'),
        ('board_unshared', 'Board Unshared'),
        ('list_created', 'List Created'),
        ('list_updated', 'List Updated'),
        ('list_deleted', 'List Deleted'),
        ('card_created', 'Card Created'),
        ('card_updated', 'Card Updated'),
        ('card_deleted', 'Card Deleted'),
        ('card_moved', 'Card Moved'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    board = models.ForeignKey('Board', on_delete=models.CASCADE, null=True, blank=True)
    list = models.ForeignKey('List', on_delete=models.SET_NULL, null=True, blank=True)
    card = models.ForeignKey('Card', on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} {self.get_action_display()} at {self.timestamp}"
    
class Comment(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    guest_name = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.user:
            return f"{self.user.username}: {self.content[:20]}"
        return f"Guest({self.guest_namne}): {self.content[:20]}"