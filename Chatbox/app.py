from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model
model = joblib.load('chatbot_model.pkl')

# Function to process user messages and predict intent
def process_message(message):
    intent = model.predict([message])[0]  # Predict intent using the model
    return intent

# Define responses based on intent
# Define responses based on intent
intent_responses = {
    "greeting": "Hello! How can I assist you today?",

    "working_hours": "Post offices in India generally operate from 9:00 AM to 5:00 PM, Monday to Saturday, except on public holidays. However, timings may vary by location.",
    
    "contact_support": "You can contact India Post customer support by calling their toll-free number 1800-266-6868 or by visiting the official India Post website.",    
    # Add responses for other intents
    "postal_services": "India Post offers a wide range of services including Postal Life Insurance (PLI), money transfer services (such as Money Orders and Western Union), and assistance with government schemes like Public Provident Fund (PPF), National Savings Certificate (NSC), and more.",
    
    "post_office_services": "India Post provides services like postage, speed post, registered post, money order, parcel delivery, postal life insurance (PLI), savings schemes like PPF, NSC, RD, and various government services.",
    
    "money_transfer": "India Post offers various money transfer services including Domestic Money Transfer (DMT), Western Union Money Transfer, and Electronic Money Orders (eMO) for safe and reliable transactions.",
    
    "insurance_services": "India Post provides Postal Life Insurance (PLI) and Rural Postal Life Insurance (RPLI), offering life insurance products with affordable premiums and attractive returns.",
    
    "savings_schemes": "India Post offers a variety of savings schemes including Public Provident Fund (PPF), National Savings Certificates (NSC), Senior Citizens Savings Scheme (SCSS), Recurring Deposit (RD), and Sukanya Samriddhi Yojana.",
    
    "banking_services": "India Post offers banking services through India Post Payments Bank (IPPB). These services include savings accounts, digital banking, money transfer, bill payments, and more.",
    
    "sukanya_samriddhi": "Sukanya Samriddhi Yojana is a savings scheme for the education and marriage of a girl child. It offers high interest rates and tax benefits under Section 80C.",
    
    "ppf": "Public Provident Fund (PPF) is a long-term savings scheme that offers tax benefits and attractive interest rates, suitable for individuals looking to save for retirement.",
    
    "nsc": "National Savings Certificate (NSC) is a fixed-income savings scheme offering guaranteed returns, suitable for individuals looking for a secure, tax-saving investment option.",
    
    "rd": "India Post offers the Recurring Deposit (RD) scheme, allowing you to save small amounts every month with guaranteed returns and competitive interest rates.",
    
    "online_services": "India Post provides online services such as tracking your post, booking speed post, applying for savings schemes like PPF, NSC, and Sukanya Samriddhi, and accessing postal life insurance details.",
    
    "tracking_services": "India Post provides online tracking services for letters, parcels, and speed posts. You can track your consignment using the tracking number on the India Post website."
}


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    if not user_message:
        return jsonify({'response': 'No message provided'}), 400
    
    # Predict the intent
    predicted_intent = process_message(user_message)
    
    # Get the response based on predicted intent
    bot_response = intent_responses.get(predicted_intent, "Sorry, I didn't understand that.")
    
    return jsonify({'response': bot_response})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
