import sys
import pickle
import os

# Get the absolute path of the model file
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
vec_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

# Load the model and vectorizer
with open(model_path, 'rb') as f:
    clf = pickle.load(f)
with open(vec_path, 'rb') as f:
    vec = pickle.load(f)

# Read review from command-line arguments
if len(sys.argv) < 2:
    print("Error: No review provided")
    sys.exit(1)

review = sys.argv[1]

# Transform the review and predict sentiment
review_vec = vec.transform([review])
prediction = clf.predict(review_vec)

# Output the prediction
print(prediction[0])  # Assuming the model returns a single label
