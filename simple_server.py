from fastapi import FastAPI

app = FastAPI(title="Test Tournament API", version="1.0.0")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-01-20T15:44:00"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)