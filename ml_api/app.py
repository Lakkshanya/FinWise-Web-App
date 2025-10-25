from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, top_k_accuracy_score
from sklearn.utils import resample

app = Flask(__name__)
CORS(app)

# =========================
# Load dataset
# =========================
df = pd.read_csv("data/optimized_schemes.csv")
df['eligibility'] = df['eligibility'].fillna('')
df['benefits'] = df['benefits'].fillna('')
df['documents'] = df['documents'].fillna('')
df['state'] = df['state'].fillna('').str.title()

# =========================
# Scheme category
# =========================
def assign_category(scheme_name, eligibility_text):
    text = (scheme_name + " " + eligibility_text).lower()
    if any(k in text for k in ['farmer', 'rythu', 'agriculture']):
        return 'Farmer'
    if any(k in text for k in ['youth', 'student', 'hostel']):
        return 'Youth'
    if any(k in text for k in ['women', 'girl']):
        return 'Women'
    if any(k in text for k in ['senior', 'aged', 'pension']):
        return 'Senior'
    if any(k in text for k in ['msme', 'self-employment', 'entrepreneur']):
        return 'MSME'
    return 'Other'

df['category'] = df.apply(lambda x: assign_category(x['scheme_name'], x['eligibility']), axis=1)

# =========================
# Feature extraction
# =========================
def extract_age(text):
    match = re.search(r'(\d{1,2})\s*[–-]\s*(\d{1,2})', text)
    if match:
        return int(match.group(1)), int(match.group(2))
    match2 = re.search(r'(\d{1,2})\s*(?:years?|yrs?)', text)
    if match2:
        age = int(match2.group(1))
        return age, age
    return 0, 100

def extract_income(text):
    match = re.search(r'\b\d{4,8}\b', text.replace(',', ''))
    if match:
        return int(match.group(0))
    return 1000000

def extract_occupation(text):
    occupations = ['farmer','worker','women','student','youth','msme','engineer','unemployed','self-employed']
    return {f'is_{occ}': int(occ in text.lower()) for occ in occupations}

def extract_keywords(text):
    # Important keywords to improve accuracy
    keywords = ['degree','pension','subsidy','loan','training','scheme','hostel']
    return {f'has_{k}': int(k in text.lower()) for k in keywords}

# Apply features
df['age_min'], df['age_max'] = zip(*df['eligibility'].apply(extract_age))
df['income_max'] = df['eligibility'].apply(extract_income)
occ_df = df['eligibility'].apply(lambda x: pd.Series(extract_occupation(x)))
kw_df = df['eligibility'].apply(lambda x: pd.Series(extract_keywords(x)))
df = pd.concat([df, occ_df, kw_df], axis=1)

# Age and income bins
df['age_group'] = pd.cut(df['age_min'], bins=[0,18,35,50,65,100], labels=[0,1,2,3,4])
df['income_group'] = pd.cut(df['income_max'], bins=[0,50000,100000,500000,1000000], labels=[0,1,2,3])

df['age_min'] = df['age_min'].clip(0,100)
df['age_max'] = df['age_max'].clip(0,100)
df['income_max'] = df['income_max'].clip(0,1000000)

# =========================
# Oversample minority classes
# =========================
df_majority = df[df['category']=='Other']
dfs = [df_majority]
for cat in df['category'].unique():
    if cat=='Other': continue
    df_min = df[df['category']==cat]
    df_min_upsampled = resample(df_min, replace=True, n_samples=len(df_majority), random_state=42)
    dfs.append(df_min_upsampled)
df_balanced = pd.concat(dfs)

# =========================
# Prepare features
# =========================
feature_cols = ['age_min','age_max','income_max','age_group','income_group'] + list(occ_df.columns) + list(kw_df.columns) + ['state']
X = pd.get_dummies(df_balanced[feature_cols])
y = df_balanced['category']

scaler = StandardScaler()
numeric_cols = ['age_min','age_max','income_max']
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)

# =========================
# Ensemble: Random Forest + Gradient Boosting
# =========================
rf = RandomForestClassifier(n_estimators=400, max_depth=25, class_weight='balanced', random_state=42)
gb = GradientBoostingClassifier(n_estimators=300, max_depth=5, random_state=42)

rf.fit(X_train, y_train)
gb.fit(X_train, y_train)

# Combined prediction: average probability
rf_probs = rf.predict_proba(X_test)
gb_probs = gb.predict_proba(X_test)
avg_probs = (rf_probs + gb_probs)/2
y_pred = [rf.classes_[i] for i in avg_probs.argmax(axis=1)]

acc = accuracy_score(y_test, y_pred)
top3_acc = top_k_accuracy_score(y_test, avg_probs, k=3)
print("✅ Ensemble Model trained successfully.")
print("Accuracy:", round(acc*100,2), "%")
print("Top-3 Accuracy:", round(top3_acc*100,2), "%")
print("Classification Report:\n", classification_report(y_test, y_pred, zero_division=0))

# =========================
# Prediction endpoint
# =========================
states = df['state'].unique().tolist()

@app.route("/predict", methods=['POST'])
def predict_schemes():
    data = request.json
    age = int(data.get("age",0))
    income = int(data.get("income",0))
    occupation = data.get("occupation","").strip().lower()
    state = data.get("state","").strip().title()

    if state not in states:
        return jsonify({"message":"Invalid or unsupported state input."}),400

    occ_features = {f'is_{occ}': int(occ in occupation) for occ in ['farmer','worker','women','student','youth','msme','engineer','unemployed','self-employed']}
    kw_features = {f'has_{k}': int(k in occupation) for k in ['degree','pension','subsidy','loan','training','scheme','hostel']}

    input_dict = {'age_min':age,'age_max':age,'income_max':income}
    input_dict.update(occ_features)
    input_dict.update(kw_features)

    # Age & income bins
    input_dict['age_group'] = 0 if age<=18 else 1 if age<=35 else 2 if age<=50 else 3 if age<=65 else 4
    input_dict['income_group'] = 0 if income<=50000 else 1 if income<=100000 else 2 if income<=500000 else 3
    input_dict['state'] = state

    input_df = pd.DataFrame([input_dict])
    input_df = pd.get_dummies(input_df)
    for col in X.columns:
        if col not in input_df.columns:
            input_df[col]=0
    input_df = input_df[X.columns]
    input_df[numeric_cols] = scaler.transform(input_df[numeric_cols])

    # Ensemble probability
    rf_prob = rf.predict_proba(input_df)
    gb_prob = gb.predict_proba(input_df)
    avg_prob = (rf_prob + gb_prob)/2
    pred_category = [rf.classes_[i] for i in avg_prob.argmax(axis=1)][0]

    # Matching score ranking
    candidates = df[(df['category']==pred_category) & (df['state']==state)].copy()
    def compute_score(row):
        score=0
        if row['age_min'] <= age <= row['age_max']: score+=1
        if income <= row['income_max']: score+=1
        for occ in ['farmer','worker','women','student','youth','msme','engineer','unemployed','self-employed']:
            if occ in occupation and row.get(f'is_{occ}',0)==1: score+=1
        return score

    candidates['score'] = candidates.apply(compute_score, axis=1)
    top_schemes = candidates.sort_values(by='score',ascending=False).head(5)['scheme_name'].tolist()

    return jsonify({
        "predicted_category": pred_category,
        "schemes": top_schemes,
        "accuracy": round(acc*100,2),
        "top3_accuracy": round(top3_acc*100,2)
    })

if __name__=="__main__":
    app.run(port=8000, debug=True)
