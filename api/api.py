from flask import Flask
from flask_cors import CORS
from requests import get, Response

app = Flask(__name__, static_folder="../build", static_url_path="/")
CORS(app)


@app.route("/api")
def get_fantasy_data():
    response: Response = get("https://fantasy.premierleague.com/api/bootstrap-static/")
    if response.status_code == 200:
        return response.json()
