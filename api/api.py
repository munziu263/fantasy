import json
import os
import json
from flask import Flask, request
from flask_cors import CORS
from requests import get, Response
import pandas as pd
from optimiser.fetch_fpl_history import fetch_and_save_history
from optimiser.optimise import get_optimal_squad
from optimiser.common import DATA_DIR

app = Flask(__name__, static_folder="../build", static_url_path="/")
CORS(app)

# fetch_and_save_history()


def generate_team(
    exclude_players: list[str] = None, formation: str = "2-5-5-3", budget: float = 100.0
):
    player_info = pd.read_csv(os.path.join(DATA_DIR, "fpl_history.csv"))
    if exclude_players:
        player_info = player_info.loc[lambda df: ~df["full_name"].isin(exclude_players)]

    squad, soln = get_optimal_squad(player_info, formation, budget)

    return squad, soln


@app.route("/api")
def get_fantasy_data():
    response: Response = get("https://fantasy.premierleague.com/api/bootstrap-static/")
    if response.status_code == 200:
        return response.json()


@app.route("/api/generate", methods=["GET", "POST"])
def generate_optimal_team():
    if request.method == "POST":
        data = json.loads(request.data)
        print(data)
        team, solution = generate_team(
            data["exclude_players"], data["formation"], data["budget"] / 10
        )
        return {"team": team, "solution": solution}
    team, solution = generate_team()
    return {"team": team, "solution": solution}
