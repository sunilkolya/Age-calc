# model_train.py
# Machine Learning model training for Age Calculator
# Target Date: 31 March 2026

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
from datetime import datetime

def generate_dataset(num_samples=10000):
    """
    Creates a synthetic dataset mapping (year, month, day) to age as of 31 March 2026.
    """
    # Target date
    target_date = datetime(2026, 3, 31)
    
    # Random birth dates between 1950 and 2025
    years = np.random.randint(1950, 2026, num_samples)
    months = np.random.randint(1, 13, num_samples)
    days = np.random.randint(1, 29, num_samples) # Keeping it simple with 28 days to avoid date validation issues
    
    ages = []
    for y, m, d in zip(years, months, days):
        birth_date = datetime(y, m, d)
        # Calculate age float
        diff = target_date - birth_date
        age = diff.days / 365.25
        ages.append(max(0, age))
        
    X = np.column_stack((years, months, days))
    y = np.array(ages)
    
    return X, y

def train_and_save():
    print("Generating training data...")
    X, y = generate_dataset()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Calculate score
    score = model.score(X_test, y_test)
    print(f"Model Accuracy (R^2 Score): {score:.4f}")
    
    # Save the model
    joblib.dump(model, 'model.pkl')
    print("Model saved as model.pkl")

if __name__ == "__main__":
    train_and_save()
