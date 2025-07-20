#!/usr/bin/env python3
import sys
import traceback

try:
    print("Testing imports...")
    
    from fastapi import FastAPI, HTTPException, Depends, status
    print("✅ FastAPI imports OK")
    
    from fastapi.middleware.cors import CORSMiddleware
    print("✅ CORS middleware import OK")
    
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    print("✅ Security imports OK")
    
    from pymongo import MongoClient
    print("✅ PyMongo import OK")
    
    from pydantic import BaseModel, EmailStr
    print("✅ Pydantic imports OK")
    
    from datetime import datetime, timedelta
    print("✅ Datetime imports OK")
    
    from typing import Optional, List, Dict, Any, Union
    print("✅ Typing imports OK")
    
    import os
    from dotenv import load_dotenv
    print("✅ Environment imports OK")
    
    import jwt
    from passlib.context import CryptContext
    print("✅ Auth imports OK")
    
    import uuid, httpx, json, base64, asyncio
    print("✅ Utility imports OK")
    
    import qrcode
    from io import BytesIO
    print("✅ QR code imports OK")
    
    import numpy as np
    print("✅ NumPy import OK")
    
    # Test FastAPI app creation
    app = FastAPI(title="Test API", version="1.0.0")
    print("✅ FastAPI app creation OK")
    
    # Test middleware addition
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("✅ CORS middleware addition OK")
    
    print("All imports and basic setup successful!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    traceback.print_exc()
    sys.exit(1)