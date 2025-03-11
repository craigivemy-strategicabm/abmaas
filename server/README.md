# ABMaaS Deliverable Recommender API

This backend API serves as a proxy between the ABMaaS frontend application and the OpenAI GPT-4 API. It provides secure access to GPT-4 for generating deliverable recommendations based on user queries.

## Setup Instructions

### 1. Install Dependencies

From the server directory, run:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
```

Replace `your_openai_api_key_here` with your actual OpenAI API key from your GPT Team account.

### 3. Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

## API Endpoints

### POST /api/recommendations

Generates deliverable recommendations based on user query and available deliverables.

**Request Body:**

```json
{
  "query": "I need help with account selection",
  "deliverables": {
    "foundations": [...],
    "insights": [...],
    "engagement": [...],
    "revenueContent": [...],
    "revenue": [...],
    "training": [...]
  },
  "selectedTier": "Tactical ABM"
}
```

**Response:**

```json
{
  "recommendation": "Based on your needs, I recommend...",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

## Frontend Integration

To use the real GPT-4 API instead of the mock service:

1. Set the environment variable `REACT_APP_USE_GPT4=true` in your frontend application
2. Ensure the backend server is running at the URL specified in `REACT_APP_API_URL` (defaults to http://localhost:3001)

## Error Handling

The API includes error handling for:
- Invalid API keys
- Rate limiting
- Network errors
- Malformed requests

All errors are logged on the server and returned to the client with appropriate status codes and messages.
