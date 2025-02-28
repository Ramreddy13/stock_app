from flask import Flask, jsonify, render_template
from flask_cors import CORS  # Import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load and clean CSV data
csv_path = "dump.csv"
df = pd.read_csv(csv_path)
df.fillna("N/A", inplace=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/companies", methods=["GET"])
def get_companies():
    return jsonify(df["index_name"].unique().tolist())

@app.route("/data/<company>", methods=["GET"])
def get_company_data(company):
    data = df[df["index_name"] == company].to_dict(orient="records")
    return jsonify(data)




if __name__ == "__main__":
    app.run(debug=True)
