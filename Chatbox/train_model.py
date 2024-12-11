import numpy as np
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Sample intents data
intents = [
    {"tag": "working_hours", "patterns": [
        "What are the working hours of post offices?",
        "Post office timings",
        "India Post office working hours",
        "What time does the post office open?",
        "What time does the post office close?"
    ]},
    {"tag": "contact_support", "patterns": [
        "How can I contact customer support?",
        "India Post customer care number",
        "Helpdesk contact details",
        "Customer service of India Post",
        "Support contact"
    ]},
    {"tag": "ppf", "patterns": [
        "Tell me about PPF",
        "What is Public Provident Fund?",
        "Explain PPF",
        "Details about Public Provident Fund",
        "What are the benefits of PPF?"
    ]},
    {"tag": "rd", "patterns": [
        "Tell me about RD",
        "What is Recurring Deposit?",
        "Explain RD",
        "Details about Recurring Deposit",
        "What are the benefits of RD?"
    ]},
    {"tag": "greeting", "patterns": [
        "Hi", "Hello", "Hey", "Good morning", "Good evening", "Hi there", "Hello there"
    ]},
    {"tag": "tracking_services", "patterns": [
        "How can I track my post?",
        "Details about tracking services",
        "Track my parcel",
        "How to track my speed post?",
        "India Post tracking services"
    ]}
]


# Prepare data for training
patterns = []
labels = []

for intent in intents:
    for pattern in intent['patterns']:
        patterns.append(pattern)
        labels.append(intent['tag'])
        
# Create a pipeline
model = make_pipeline(TfidfVectorizer(stop_words='english'), MultinomialNB(alpha=0.1))
# Split data into train and test sets (for evaluation)
X_train, X_test, y_train, y_test = train_test_split(patterns, labels, test_size=0.2)

# Train the model
model.fit(X_train, y_train)

# Evaluate the model (optional)
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")

# Save the model
import joblib
joblib.dump(model, 'chatbot_model.pkl')
