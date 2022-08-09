from flask import Flask
from requests import get, Response

app = Flask(__name__)


@app.route("/api")
def get_fantasy_data():
    response: Response = requests.get(
        "https://fantasy.premierleague.com/api/bootstrap-static/"
    )
    if response.status_code == 200:
        return response.json()
