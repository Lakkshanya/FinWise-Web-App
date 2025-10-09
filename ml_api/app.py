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
df = pd.read_csv("data/updated_schemes.csv")

df['eligibility'] = df['eligibility'].fillna('')
df['benefits'] = df['benefits'].fillna('')
df['documents'] = df['documents'].fillna('')
df['state'] = df['state'].fillna('').str.title()

# -------------------------------
# Feature extraction
# -------------------------------
def extract_age(text):
    match = re.search(r'(\d{1,2})\s*[–-]\s*(\d{1,2})', text)
    if match:
        return int(match.group(1)), int(match.group(2))
    return 0, 100

def extract_occupation(text):
    occupations = ['farmer', 'worker', 'women', 'student', 'youth', 'msme', 'engineer', 'unemployed', 'self-employed']
    for occ in occupations:
        if occ.lower() in text.lower():
            return occ.lower()
    return 'any'

def extract_income(text):
    match = re.search(r'\b\d{5,9}\b', text.replace(',', ''))
    if match:
        return int(match.group(0))
    return 10000000

df['age_min'], df['age_max'] = zip(*df['eligibility'].apply(extract_age))
df['occupation'] = df['eligibility'].apply(extract_occupation).fillna('any').str.lower()
df['income_max'] = df['eligibility'].apply(extract_income)

states = sorted(df['state'].dropna().unique().tolist())

# -------------------------------
# Train ML model
# -------------------------------
X = pd.get_dummies(df[['age_min', 'age_max', 'income_max', 'occupation', 'state']])
y = df['scheme_name']

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

# -------------------------------
# Prediction endpoint
# -------------------------------
@app.route("/predict", methods=['POST'])
def predict_schemes():
    data = request.json
    age = int(data.get("age", 0))
    income = int(data.get("income", 0))
    occupation = data.get("occupation", "any").strip().lower()
    state = data.get("state", "").strip().title()

    print("Received input:", data)
    print("Normalized input:", age, income, occupation, state)

    if state not in states:
        return jsonify({"message": "Invalid or unsupported state input."})

    eligible_df = df[df['state'] == state]
    if eligible_df.empty:
        return jsonify({"message": "No eligible schemes found for this state."})

    input_df = pd.DataFrame([{
        'age_min': age,
        'age_max': age,
        'income_max': income,
        'occupation': occupation,
        'state': state
    }])
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=X.columns, fill_value=0)

    pred = rf.predict_proba([input_df.iloc[0]])[0]
    top_indices = pred.argsort()[::-1][:5]
    top_schemes = [rf.classes_[i] for i in top_indices]

    matched_schemes = eligible_df[eligible_df['scheme_name'].isin(top_schemes)]

    if matched_schemes.empty:
        return jsonify({"message": "No eligible schemes found for the given input."})

    return jsonify({"schemes": matched_schemes['scheme_name'].tolist()})

# -------------------------------
if __name__ == "__main__":
    app.run(port=8000, debug=True)