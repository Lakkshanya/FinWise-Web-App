from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import re

app = Flask(__name__)
CORS(app)

# -------------------------------
# Load and preprocess dataset
# -------------------------------
df = pd.read_csv("data/updated_data.csv")

# Fill missing eligibility and benefits
df['eligibility'] = df['eligibility'].fillna('')
df['benefits'] = df['benefits'].fillna('')
df['documents'] = df['documents'].fillna('')

# Extract age_min and age_max from eligibility text
def extract_age(text):
    match = re.search(r'(\d{1,2})\s*[–-]\s*(\d{1,2})', text)
    if match:
        return int(match.group(1)), int(match.group(2))
    return 0, 100  # default if age not found

df[['age_min','age_max']] = df['eligibility'].apply(lambda x: pd.Series(extract_age(x)))

# Extract occupation keywords
def extract_occupation(text):
    occupations = ['farmer', 'worker', 'women', 'student', 'youth', 'msme']
    for occ in occupations:
        if occ.lower() in text.lower():
            return occ
    return 'any'

df['occupation'] = df['eligibility'].apply(extract_occupation)

# Extract income max from text (numbers in eligibility)
def extract_income(text):
    match = re.search(r'\b\d{5,9}\b', text.replace(',', ''))
    if match:
        return int(match.group(0))
    return 10000000  # default high value if not mentioned

df['income_max'] = df['eligibility'].apply(extract_income)

# Extract state if mentioned
states = ['Maharashtra', 'Karnataka', 'Rajasthan', 'Andhra Pradesh', 'Delhi']
def extract_state(text):
    for st in states:
        if st.lower() in text.lower():
            return st
    return 'any'

df['state'] = df['eligibility'].apply(extract_state)

# -------------------------------
# Prepare features and target
# -------------------------------
df['occupation'] = df['occupation'].fillna('any')
df['state'] = df['state'].fillna('any')

X = pd.get_dummies(df[['age_min','age_max','income_max','occupation','state']])
y = df['scheme_name']

# Train Random Forest Classifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

# -------------------------------
# Flask API for prediction
# -------------------------------
@app.route("/predict", methods=['POST'])
def predict_schemes():
    data = request.json
    age = data.get("age")
    income = data.get("income")
    occupation = data.get("occupation", "any")
    state = data.get("state", "any")

    # Prepare input row
    input_df = pd.DataFrame([{
        'age_min': age,
        'age_max': age,
        'income_max': income,
        'occupation': occupation,
        'state': state
    }])
    input_df = pd.get_dummies(input_df)
    
    # Align columns with training data
    input_df = input_df.reindex(columns=X.columns, fill_value=0)

    # Predict schemes
    pred = rf.predict([input_df.iloc[0]])
    return jsonify({"schemes": pred.tolist()})

# -------------------------------
if __name__ == "__main__":
    app.run(port=8000, debug=True)
