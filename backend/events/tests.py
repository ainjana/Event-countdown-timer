from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
import datetime

from .models import Event


class EventAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.user1 = User.objects.create_user(username='user1', password='Password123!', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='Password123!', email='user2@example.com')
        
        # Get JWT tokens for user1
        login_res1 = self.client.post('/api/auth/login/', {'username': 'user1', 'password': 'Password123!'})
        self.token1 = login_res1.data['access']
        
        # Get JWT tokens for user2
        login_res2 = self.client.post('/api/auth/login/', {'username': 'user2', 'password': 'Password123!'})
        self.token2 = login_res2.data['access']
        
        # Sample event for user1
        self.future_date = timezone.now() + datetime.timedelta(days=10)
        self.event1 = Event.objects.create(
            title="User 1 Trip",
            description="Family trip to Hawaii",
            category="Trip",
            target_date=self.future_date,
            owner=self.user1
        )

    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'NewPassword123!',
            'password_confirm': 'NewPassword123!',
            'email': 'newuser@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)

    def test_user_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'user1',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_get_me(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'user1')

    def test_create_event(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        payload = {
            'title': 'Goa Trip',
            'description': 'Vacation with friends',
            'category': 'Trip',
            'target_date': (timezone.now() + datetime.timedelta(days=30)).isoformat()
        }
        response = self.client.post('/api/events/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Goa Trip')
        self.assertEqual(response.data['owner']['username'], 'user1')

    def test_event_listing_and_user_isolation(self):
        # User 2 creates an event
        Event.objects.create(
            title="User 2 Birthday",
            category="Birthday",
            target_date=timezone.now() + datetime.timedelta(days=5),
            owner=self.user2
        )
        
        # User 1 views events -> should ONLY see user1's event
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "User 1 Trip")

    def test_update_event(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        payload = {
            'title': 'User 1 Trip Updated',
            'target_date': self.future_date.isoformat()
        }
        response = self.client.patch(f'/api/events/{self.event1.id}/', payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'User 1 Trip Updated')

    def test_delete_event(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        response = self.client.delete(f'/api/events/{self.event1.id}/')
        self.assertEqual(response.status_code, status.HTTP_24_NO_CONTENT if hasattr(status, 'HTTP_24_NO_CONTENT') else 204)
        self.assertFalse(Event.objects.filter(id=self.event1.id).exists())

    def test_unauthorized_access_protection(self):
        # User 2 tries to view User 1's event directly
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        response = self.client.get(f'/api/events/{self.event1.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_delete_attempt(self):
        # User 2 tries to delete User 1's event
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        response = self.client.delete(f'/api/events/{self.event1.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Event.objects.filter(id=self.event1.id).exists())

    def test_invalid_event_creation(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        # Missing title
        response = self.client.post('/api/events/', {
            'target_date': self.future_date.isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Invalid date string
        response = self.client.post('/api/events/', {
            'title': 'Test Event',
            'target_date': 'invalid-date-format'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
