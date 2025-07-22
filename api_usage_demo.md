# 🔐 Free Fire Tournament API - Secure Usage Guide

## Overview
The Free Fire Tournament Platform API now uses encrypted API keys for enhanced security. All API endpoints require proper authentication to prevent unauthorized usage.

## 🔑 Getting Started

### Step 1: Generate API Key
Before accessing any API endpoints, you need to generate an encrypted API key:

```bash
curl -X POST http://your-domain.com/api/auth/generate-key \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your_unique_client_id",
    "app_name": "Your Application Name"
  }'
```

**Response:**
```json
{
  "success": true,
  "api_key": "eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6InVuaXF1ZV9jbGllbnRfaWQiLCJ0aW1lc3RhbXAiOjE2OTQ3ODkyMzQsImV4cGlyZXMiOjE2OTQ4NzU2MzQsIm5vbmNlIjoiYWJjZGVmZ2gifSwic2lnbmF0dXJlIjoiZjQ4NjFhOWY4ODcwNjJhYjU2YmY2NWU4YzEzYzM1ODA2YjlkYWE4MzEyNzQxZWQyOGQ5MTZkNjI3MTgzN2Y5NSJ9",
  "client_id": "a1b2c3d4e5f67890",
  "expires_at": "2023-09-16T12:00:34.000Z",
  "expires_in_seconds": 86400,
  "rate_limit": "60 requests per minute"
}
```

### Step 2: Use API Key for Secure Requests

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://your-domain.com/api/validate-freefire?uid=5114792150&region=ind"
```

**Secure Response:**
```json
{
  "valid": true,
  "player_info": {
    "uid": "5114792150",
    "region": "IND",
    "nickname": "ᏚʀㅤᎡᴏꤪꤨʟᴇꪎㅤ",
    "level": 69,
    "avatarId": 102000007,
    "liked": 13746,
    "exp": 2581247,
    "clan_name": "CLASHㅤㅤWITH",
    "clan_level": 4
  },
  "clanBasicInfo": {
    "clanName": "CLASHㅤㅤWITH",
    "clanLevel": 4
  },
  "profileInfo": {
    "avatarId": 102000007
  },
  "client_id": "a1b2c3d4e5f67890",
  "timestamp": "2023-09-15T12:00:34.567Z"
}
```

## 🛡️ Security Features

### 1. **Encrypted API Keys**
- HMAC-SHA256 signed tokens
- Base64 encoded with payload + signature
- Client-specific unique identifiers
- Automatic expiration (24 hours default)

### 2. **Rate Limiting**
- Maximum 60 requests per minute per client
- Automatic request tracking and cleanup
- 429 status code when limit exceeded

### 3. **Request Validation**
- Signature verification on every request
- Expiration checking
- Client ID validation
- Nonce for replay attack prevention

### 4. **Error Responses**
All unauthorized requests return clear error messages:

```json
{
  "detail": "API key required. Please include Authorization header with Bearer token."
}
```

```json
{
  "detail": "Invalid API key: API key expired"
}
```

```json
{
  "detail": "Rate limit exceeded. Maximum 60 requests per minute."
}
```

## 🚫 What's Protected

### Without Valid API Key:
- ❌ `/api/validate-freefire` - Free Fire UID validation
- ❌ Direct API access from external applications
- ❌ Unlimited requests
- ❌ API scraping or abuse

### What Still Works:
- ✅ `/api/health` - Basic health check
- ✅ Frontend application (auto-generates keys)
- ✅ Legitimate authenticated usage

## 💡 Implementation Examples

### JavaScript/Node.js
```javascript
// Generate API Key
const response = await fetch('/api/auth/generate-key', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'my-app-' + Date.now(),
    app_name: 'My Free Fire App'
  })
});

const { api_key } = await response.json();

// Use API Key
const playerData = await fetch('/api/validate-freefire?uid=123456789&region=ind', {
  headers: { 'Authorization': `Bearer ${api_key}` }
});
```

### Python
```python
import requests

# Generate API Key
key_response = requests.post('http://localhost:8001/api/auth/generate-key', json={
    'client_id': 'python-app-123',
    'app_name': 'Python Free Fire Client'
})
api_key = key_response.json()['api_key']

# Use API Key
headers = {'Authorization': f'Bearer {api_key}'}
player_response = requests.get(
    'http://localhost:8001/api/validate-freefire?uid=5114792150&region=ind',
    headers=headers
)
```

## 🔧 Configuration

The API security system includes:

- **Secret Key**: Randomly generated 32-byte URL-safe key
- **Cache**: In-memory storage for active API keys
- **Rate Limiting**: 60 requests/minute (configurable)
- **Expiration**: 24 hours default (configurable)

## 🎯 Benefits

1. **Prevents API Abuse**: Unauthorized usage blocked
2. **Rate Limiting**: Protects server resources
3. **Client Tracking**: Monitor API usage per client
4. **Automatic Cleanup**: Expired keys removed automatically
5. **Secure Communication**: Encrypted tokens prevent tampering

---

**🔒 Your API is now secure and protected from unauthorized access!**