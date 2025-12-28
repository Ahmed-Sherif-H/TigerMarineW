#!/bin/bash
# Local Testing Script
# Tests both frontend and backend locally

echo "🧪 Testing Tiger Marine Locally"
echo "================================"

# Check if backend is running
echo ""
echo "1. Checking backend..."
BACKEND_STATUS=$(curl -s http://localhost:3001/api/health | grep -o '"status":"ok"' || echo "FAILED")

if [ "$BACKEND_STATUS" = '"status":"ok"' ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
    echo "   Start backend: cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo ""
echo "2. Checking frontend..."
FRONTEND_STATUS=$(curl -s http://localhost:5173 | grep -o "Tiger Marine" || echo "FAILED")

if [ "$FRONTEND_STATUS" != "FAILED" ]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not running"
    echo "   Start frontend: cd frontend && npm run dev"
    exit 1
fi

# Test API endpoints
echo ""
echo "3. Testing API endpoints..."

# Test models endpoint
MODELS=$(curl -s http://localhost:3001/api/models | grep -o '"success":true' || echo "FAILED")
if [ "$MODELS" = '"success":true' ]; then
    echo "✅ Models endpoint working"
else
    echo "❌ Models endpoint failed"
fi

# Test categories endpoint
CATEGORIES=$(curl -s http://localhost:3001/api/categories | grep -o '"success":true' || echo "FAILED")
if [ "$CATEGORIES" = '"success":true' ]; then
    echo "✅ Categories endpoint working"
else
    echo "❌ Categories endpoint failed"
fi

echo ""
echo "✅ Local testing complete!"
echo ""
echo "Access points:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo "  Admin:    http://localhost:5173/admin"

