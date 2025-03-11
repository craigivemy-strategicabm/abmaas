#!/bin/bash

# Test query
QUERY="I need help with a stalled deal that's not progressing. What playbooks do you recommend?"

# Make the API call to our debug endpoint
curl -X POST http://localhost:3001/api/debug-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "query": "'"$QUERY"'",
    "deliverables": {
      "insights": [
        {"title": "Sample Insight", "tacticalCredits": "2", "impactCredits": "2", "enterpriseCredits": "2", "customPrice": "2"}
      ],
      "engagement": [
        {"title": "Sample Engagement", "tacticalCredits": "8", "impactCredits": "8", "enterpriseCredits": "8", "customPrice": "8"}
      ]
    },
    "selectedTier": "Tactical ABM",
    "playbooks": [
      {
        "title": "Unblock a stalled deal",
        "category": "net-new",
        "stage": "Influence",
        "tacticalCredits": "8",
        "impactCredits": "8",
        "enterpriseCredits": "7",
        "customPrice": "8",
        "description": "A strategic playbook designed to reactivate and accelerate stalled opportunities through targeted engagement and value reinforcement."
      },
      {
        "title": "Pipeline velocity",
        "category": "net-new",
        "stage": "Influence",
        "tacticalCredits": "8",
        "impactCredits": "8",
        "enterpriseCredits": "7",
        "customPrice": "8",
        "description": "A strategic framework to accelerate deal progression through targeted engagement tactics."
      }
    ],
    "descriptions": {
      "Unblock a stalled deal": "This playbook focuses on reactivating and accelerating stalled opportunities through targeted engagement and value reinforcement."
    },
    "activationItems": [
      {"title": "Unblock a stalled deal", "tacticalCredits": "8", "impactCredits": "8", "enterpriseCredits": "7", "customPrice": "8"}
    ],
    "expandedItems": ["Unblock a stalled deal"]
  }' | jq

echo -e "\nTest completed."
