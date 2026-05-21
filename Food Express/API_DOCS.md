# API Documentation

Complete API reference for Food Express backend.

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://api.foodexpress.com`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "BadRequest"
}
```

---

## Authentication Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "password": "password123"
}

Response: 201 Created
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Restaurant Endpoints

### List All Restaurants

```
GET /restaurants?search=pizza&cuisine=Italian

Response: 200 OK
[
  {
    "id": "restaurant-id",
    "name": "Pizza Palace",
    "slug": "pizza-palace",
    "image": "https://example.com/image.jpg",
    "description": "Authentic Italian pizza",
    "cuisine": ["Italian", "Pizza"],
    "rating": 4.8,
    "reviewCount": 450,
    "deliveryTime": 25,
    "deliveryFee": 2.99,
    "minOrder": 15,
    "isOpen": true,
    "address": "123 Food St, NY",
    "phone": "+1234567890"
  }
]
```

### Get Restaurant Details

```
GET /restaurants/:id

Response: 200 OK
{
  "id": "restaurant-id",
  "name": "Pizza Palace",
  "slug": "pizza-palace",
  "image": "https://example.com/image.jpg",
  "description": "Authentic Italian pizza",
  "cuisine": ["Italian", "Pizza"],
  "rating": 4.8,
  "reviewCount": 450,
  "deliveryTime": 25,
  "deliveryFee": 2.99,
  "minOrder": 15,
  "isOpen": true,
  "address": "123 Food St, NY",
  "phone": "+1234567890",
  "menuItems": [
    {
      "id": "item-id",
      "name": "Margherita Pizza",
      "price": 12.99,
      "description": "Classic pizza",
      "image": "https://example.com/pizza.jpg",
      "category": "Pizza",
      "isAvailable": true,
      "isVegetarian": true,
      "spicyLevel": "mild"
    }
  ]
}
```

### Get Restaurant Menu

```
GET /restaurants/:id/menu

Response: 200 OK
[
  {
    "id": "item-id",
    "name": "Margherita Pizza",
    "price": 12.99,
    "description": "Classic pizza",
    "image": "https://example.com/pizza.jpg",
    "category": "Pizza",
    "isAvailable": true,
    "isVegetarian": true,
    "spicyLevel": "mild",
    "rating": 4.8,
    "reviewCount": 124
  }
]
```

---

## Order Endpoints

### Get User Orders

```
GET /orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "order-id",
    "status": "DELIVERED",
    "total": 35.96,
    "subtotal": 29.97,
    "tax": 3.00,
    "deliveryFee": 2.99,
    "createdAt": "2024-01-15T14:30:00Z",
    "restaurant": {
      "id": "restaurant-id",
      "name": "Pizza Palace"
    },
    "items": [
      {
        "id": "item-id",
        "menuItem": {
          "name": "Margherita Pizza",
          "price": 12.99
        },
        "quantity": 2
      }
    ]
  }
]
```

### Get Order Details

```
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "order-id",
  "status": "DELIVERED",
  "deliveryAddress": "123 Main St",
  "deliveryPhone": "+1234567890",
  "total": 35.96,
  "subtotal": 29.97,
  "tax": 3.00,
  "deliveryFee": 2.99,
  "estimatedDeliveryTime": "2024-01-15T15:00:00Z",
  "actualDeliveryTime": "2024-01-15T14:50:00Z",
  "notes": "Please ring doorbell",
  "paymentMethod": "CARD",
  "createdAt": "2024-01-15T14:30:00Z",
  "restaurant": { ... },
  "items": [ ... ]
}
```

### Create Order

```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "restaurant-id",
  "deliveryAddress": "123 Main St, NY 10001",
  "deliveryPhone": "+1234567890",
  "paymentMethod": "CARD",
  "promoCode": "SAVE10",
  "items": [
    {
      "menuItemId": "item-id",
      "quantity": 2,
      "price": 12.99
    }
  ]
}

Response: 201 Created
{
  "id": "order-id",
  "status": "PENDING",
  "total": 35.96,
  ...
}
```

---

## Admin Endpoints

### Get Dashboard Stats

```
GET /admin/dashboard
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "totalOrders": 2543,
  "users": 1289,
  "restaurants": 250,
  "totalRevenue": 102450,
  "recentOrders": [ ... ]
}
```

### Get All Orders

```
GET /admin/orders
Authorization: Bearer <admin-token>

Response: 200 OK
[
  {
    "id": "order-id",
    "status": "DELIVERED",
    "total": 35.96,
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "restaurant": { ... },
    "items": [ ... ]
  }
]
```

### Get All Users

```
GET /admin/users
Authorization: Bearer <admin-token>

Response: 200 OK
[
  {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

## Query Parameters

### Pagination

```
GET /orders?skip=0&take=20
```

### Filtering

```
GET /restaurants?search=pizza&cuisine=Italian&minRating=4
```

### Sorting

```
GET /orders?sortBy=createdAt&order=desc
```

---

## Rate Limiting

- Default: 100 requests per minute per IP
- Authentication endpoints: 10 requests per minute

---

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Webhooks (Future)

Subscribe to events:

```
POST /webhooks/subscribe
{
  "event": "order.created",
  "url": "https://example.com/webhook"
}
```

---

## SDK/Client Libraries

Coming soon:
- JavaScript/TypeScript
- Python
- Go
- Ruby

---

For more information, visit https://docs.foodexpress.com
