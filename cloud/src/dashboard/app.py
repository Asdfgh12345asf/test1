from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, Response
from datetime import datetime, timedelta
import os, json
from pymongo import MongoClient
from bson import json_util
from typing import Dict, Any
import requests

app = FastAPI(title="Power Dashboard")

# Mount static files directory
app.mount("/static", StaticFiles(directory="./static"), name="static")

# Initialize MongoDB client
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://mongodb:27017')
client = MongoClient(MONGO_URI)
db = client.power_dashboard
power_data = db.power_data

# Get Lambda URL from environment variable
CHART_LAMBDA_URL = os.getenv('CHART_LAMBDA_URL')

def parse_json(data: Any) -> Dict:
    """Convert MongoDB BSON to JSON serializable dict"""
    return json.loads(json_util.dumps(data))

def get_latest_power_data():
    """Get the latest power data from MongoDB"""
    latest_data = power_data.find_one(
        sort=[("timestamp", -1)]
    )

    if not latest_data:
        raise HTTPException(
            status_code=404,
            detail="No power data found in database"
        )

    return parse_json(latest_data)

def get_daily_statistics():
    """Calculate daily statistics from MongoDB data"""
    now = datetime.now()
    day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Get all readings for today
    daily_readings = list(power_data.find({
        "timestamp": {
            "$gte": day_start,
            "$lte": now
        }
    }))

    if not daily_readings:
        return None

    # Calculate statistics
    power_values = [reading["power_consumption"]["current"] for reading in daily_readings]
    return {
        "daily_total": sum(power_values),
        "peak": max(power_values),
        "average": sum(power_values) / len(power_values)
    }

def get_hourly_chart_data():
    """Get hourly power consumption data for the last 24 hours"""
    now = datetime.now()
    yesterday = now - timedelta(hours=24)

    # Get readings for last 24 hours
    hourly_data = list(power_data.find({
        "timestamp": {
            "$gte": yesterday,
            "$lte": now
        }
    }).sort("timestamp", 1))

    return {
        "labels": [reading["timestamp"].strftime("%H:%M") for reading in hourly_data],
        "values": [reading["power_consumption"]["current"] for reading in hourly_data],
        "unit": "kW"
    }

@app.get("/api/power-data")
async def get_power_data():
    try:
        # Get latest reading
        latest_data = get_latest_power_data()

        # Get daily statistics
        daily_stats = get_daily_statistics()
        if daily_stats:
            latest_data["power_consumption"].update(daily_stats)

        # Get chart data
        latest_data["chart_data"]["hourly"] = get_hourly_chart_data()

        # Calculate estimated daily cost (example rate: $0.12 per kWh)
        rate_per_kwh = 0.12
        if daily_stats:
            daily_cost = daily_stats["daily_total"] * rate_per_kwh
            monthly_estimate = daily_cost * 30

            latest_data["statistics"].update({
                "daily_cost": round(daily_cost, 2),
                "monthly_estimate": round(monthly_estimate, 2),
                "currency": "USD"
            })

        return JSONResponse(content=latest_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/power-history")
async def get_power_history():
    try:
        # Get last 24 hours of data
        now = datetime.now()
        yesterday = now - timedelta(hours=24)

        history = list(power_data.find(
            {
                "timestamp": {
                    "$gte": yesterday,
                    "$lte": now
                }
            },
            sort=[("timestamp", -1)]
        ))

        return JSONResponse(content=parse_json(history))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chart")
async def proxy_chart_request(data: dict):
    try:
        lambda_url = os.getenv('CHART_LAMBDA_URL', '')
        response = requests.post(
            lambda_url,
            headers={"Content-Type": "application/json"},
            json=data
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Lambda function error")
        return Response(content=response.text, media_type="image/svg+xml")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
