from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import os

# Connect to MongoDB
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://mongodb:27017')
client = MongoClient(MONGO_URI)
db = client.power_dashboard
power_data = db.power_data

# Generate 24 hours of sample data
now = datetime.now()
for i in range(24):
    time = now - timedelta(hours=24-i)
    
    # Create sample reading
    reading = {
        "timestamp": time,
        "power_consumption": {
            "current": round(random.uniform(3.5, 7.5), 2),
            "unit": "kW"
        },
        "chart_data": {
            "hourly": {
                "labels": [],
                "values": [],
                "unit": "kW"
            }
        },
        "statistics": {
            "daily_cost": round(random.uniform(10.0, 15.0), 2),
            "monthly_estimate": round(random.uniform(280.0, 320.0), 2),
            "currency": "USD"
        },
        "status": {
            "updated_at": time,
            "system_status": "operational",
            "last_reading": time - timedelta(minutes=5)
        }
    }
    
    # Insert into MongoDB
    power_data.insert_one(reading)

print("Sample data inserted successfully!") 