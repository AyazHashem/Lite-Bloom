from dotenv import load_dotenv
import os

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") #server

#market data APIs
GOLDAPI_KEY = os.getenv("GOLDAPI_KEY")
METALS_DEV_KEY = os.getenv("METALS_DEV_KEY")
MASSIVE_API_KEY = os.getenv("MASSIVE_API_KEY")
TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY")
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")
FRED_API_KEY = os.getenv("FRED_API_KEY")
OIL_PRICE_API_KEY = os.getenv("OIL_PRICE_API_KEY")

#news APIs
GUARDIAN_API_KEY = os.getenv("GUARDIAN_API_KEY")
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

#AI
HF_TOKEN = os.getenv("HF_TOKEN")

#supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
