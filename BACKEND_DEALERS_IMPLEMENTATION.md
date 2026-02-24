# Backend Dealers API Implementation Guide

## Overview
The frontend has been updated to fetch dealers from the backend API instead of static data. You need to implement the following endpoints in your backend.

## Required API Endpoints

### 1. GET /api/dealers
**Purpose:** Get all dealers

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "company": "Donar Boats",
      "country": "Croatia",
      "address": "Riva 1, 52100 Pula, Croatia",
      "telephone": "+385 98 802 328",
      "fax": "+385 52 350 822",
      "email": "donarboats@gmail.com",
      "website": "http://www.donarboats.hr/hr"
    }
  ]
}
```

**OR** return array directly:
```json
[
  {
    "id": 1,
    "company": "Donar Boats",
    "country": "Croatia",
    ...
  }
]
```

### 2. GET /api/dealers/:id
**Purpose:** Get a single dealer by ID

**Response Format:**
```json
{
  "data": {
    "id": 1,
    "company": "Donar Boats",
    "country": "Croatia",
    "address": "Riva 1, 52100 Pula, Croatia",
    "telephone": "+385 98 802 328",
    "fax": "+385 52 350 822",
    "email": "donarboats@gmail.com",
    "website": "http://www.donarboats.hr/hr"
  }
}
```

**OR** return object directly:
```json
{
  "id": 1,
  "company": "Donar Boats",
  ...
}
```

### 3. POST /api/dealers
**Purpose:** Create a new dealer

**Request Body:**
```json
{
  "company": "Tiger Marine CENTER",
  "country": "Netherlands",
  "address": "Delftweg 129, 3043 NH Rotterdam, Netherlands",
  "telephone": null,
  "fax": null,
  "email": null,
  "website": "http://www.tigermarinecenter.nl"
}
```

**Response Format:**
```json
{
  "data": {
    "id": 20,
    "company": "Tiger Marine CENTER",
    "country": "Netherlands",
    ...
  }
}
```

**Validation:**
- `company` (required, string)
- `country` (required, string)
- `address` (optional, string)
- `telephone` (optional, string)
- `fax` (optional, string)
- `email` (optional, string, should be valid email format)
- `website` (optional, string, should be valid URL)

### 4. PUT /api/dealers/:id
**Purpose:** Update an existing dealer

**Request Body:**
```json
{
  "company": "Updated Company Name",
  "country": "Updated Country",
  "address": "Updated Address",
  "telephone": "+1234567890",
  "fax": null,
  "email": "updated@example.com",
  "website": "http://www.updated.com"
}
```

**Response Format:**
```json
{
  "data": {
    "id": 1,
    "company": "Updated Company Name",
    ...
  }
}
```

### 5. DELETE /api/dealers/:id
**Purpose:** Delete a dealer

**Response Format:**
```json
{
  "success": true,
  "message": "Dealer deleted successfully"
}
```

## Database Schema

Create a `dealers` table with the following structure:

```sql
CREATE TABLE dealers (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  address TEXT,
  telephone VARCHAR(50),
  fax VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication

All endpoints (GET, POST, PUT, DELETE) should require authentication:
- Check for `Authorization: Bearer <token>` header
- Verify the token is valid
- Return 401 Unauthorized if token is missing or invalid

## Error Handling

Return appropriate HTTP status codes:
- `200` - Success
- `201` - Created (for POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (dealer doesn't exist)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```

## Example Implementation (Node.js/Express)

```javascript
// routes/dealers.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// GET /api/dealers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM dealers ORDER BY country, company');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dealers/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM dealers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dealers
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { company, country, address, telephone, fax, email, website } = req.body;
    
    // Validation
    if (!company || !country) {
      return res.status(400).json({ error: 'Company and country are required' });
    }
    
    const result = await db.query(
      'INSERT INTO dealers (company, country, address, telephone, fax, email, website) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [company, country, address || null, telephone || null, fax || null, email || null, website || null]
    );
    
    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/dealers/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, country, address, telephone, fax, email, website } = req.body;
    
    // Validation
    if (!company || !country) {
      return res.status(400).json({ error: 'Company and country are required' });
    }
    
    const result = await db.query(
      'UPDATE dealers SET company = $1, country = $2, address = $3, telephone = $4, fax = $5, email = $6, website = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [company, country, address || null, telephone || null, fax || null, email || null, website || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/dealers/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM dealers WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    
    res.json({ success: true, message: 'Dealer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Testing

After implementing the endpoints, test them:

1. **GET all dealers** - Should return list of all dealers
2. **GET single dealer** - Should return dealer by ID
3. **POST create dealer** - Should create new dealer and return it
4. **PUT update dealer** - Should update existing dealer
5. **DELETE dealer** - Should delete dealer and return success

## Migration from Static Data

If you have static dealer data in your codebase, you can create a migration script to populate the database:

```javascript
// scripts/migrateDealers.js
const dealers = require('../data/models').dealers;
const db = require('../db');

async function migrateDealers() {
  for (const dealer of dealers) {
    await db.query(
      'INSERT INTO dealers (company, country, address, telephone, fax, email, website) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
      [dealer.company, dealer.country, dealer.address, dealer.telephone, dealer.fax, dealer.email, dealer.website]
    );
  }
  console.log('Dealers migrated successfully');
}
```

## Frontend Changes Summary

The frontend has been updated to:
- ✅ Remove all localStorage logic
- ✅ Fetch dealers from `/api/dealers` endpoint
- ✅ Use API for create, update, delete operations
- ✅ Handle errors properly
- ✅ Show loading states

Once you implement these backend endpoints, the dealers functionality will work end-to-end!
