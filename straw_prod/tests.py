from django.test import TestCase
from .models import Person


class StrawProdTests(TestCase):
    def setUp(self):
        # Create test data for persons
        Person.objects.create(
            name="Test Person", 
            age=25, gender="M", 
            debut_date="2020-01-01", 
            agency="Test Agency", 
            followers=1000, 
            popularity_rank=1, 
            status="A", 
            talent_type="idol"
            )
        
    def test_person_creation(self):
        person = Person.objects.get(name="Test Person")
        self.assertEqual(person.age, 25)
        self.assertEqual(person.gender, "M")
        self.assertEqual(person.debut_date.strftime("%Y-%m-%d"), "2020-01-01")
        self.assertEqual(person.agency, "Test Agency") 
        self.assertEqual(person.followers, 1000)
        self.assertEqual(person.popularity_rank, 1)
        self.assertEqual(person.status, "A")
        self.assertEqual(person.talent_type, "idol")
    def test_person_str(self):
        person = Person.objects.get(name="Test Person")
        self.assertEqual(str(person), "Test Person")   
        