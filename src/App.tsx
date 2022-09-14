import { useEffect, useState, MouseEvent } from "react";
import axios, { AxiosResponse } from "axios";
import "./App.css";
import { Team, Player, Position, GeneratedPlayer } from "./types";
import { PlayerCard } from "./components/PlayerCard";
import { getPosition, getPlayerPosition } from "./queries/queries";
import { PlayerCarousel } from "./components/PlayerCarousel";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [unselectedPlayers, setUnselectedPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const [budget, setBudget] = useState<number>(1000);
  const [expectedPoints, setExpectedPoints] = useState<number>(0);
  const [focusedPlayer, setFocusedPlayer] = useState<Player>();

  const POSITION_LIMIT: { [positionId: number]: number } = {
    1: 2,
    2: 5,
    3: 5,
    4: 3,
  };

  const handlePlayerSelect = (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => {
    event.preventDefault();
    setFocusedPlayer(player);
    if (
      selectedPlayers.filter(
        (currentPlayer: Player) =>
          currentPlayer.element_type === player.element_type
      ).length < POSITION_LIMIT[player.element_type] &&
      !selectedPlayers.includes(player)
    ) {
      setSelectedPlayers((prevState: Player[]) => [...prevState, player]);
      setUnselectedPlayers((prevState: Player[]) =>
        prevState.filter(
          (currentPlayer: Player) => currentPlayer.id !== player.id
        )
      );
    } else {
      console.log(
        `You have already selected the limit for ${
          getPlayerPosition(player, positions)
            ? getPlayerPosition(player, positions)?.plural_name
            : "that position"
        }`
      );
    }
  };

  const handlePlayerDeselect = (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => {
    event.preventDefault();
    setFocusedPlayer(player);
    setUnselectedPlayers((prevState: Player[]) => [...prevState, player]);
    setSelectedPlayers((prevState: Player[]) =>
      prevState.filter(
        (currentPlayer: Player) => currentPlayer.id !== player.id
      )
    );
  };

  const getOptimalTeam = () => {
    console.log("clicked");
    if (selectedPlayers.length === 0) {
      // GET OPTIMAL TEAM
      axios.get("api/generate").then((response: AxiosResponse) => {
        const generatedTeam: GeneratedPlayer[] = response.data.team;
        const names: string[] = generatedTeam.map(
          (generatedPlayer: GeneratedPlayer) => generatedPlayer.name
        );
        const team: Player[] = unselectedPlayers.filter((player: Player) =>
          names.includes(player.first_name + " " + player.second_name)
        );
        setSelectedPlayers(team);
        setUnselectedPlayers((prevState: Player[]) =>
          prevState.filter((player: Player) => !team.includes(player))
        );
      });
    } else {
      // TELL THE BACKEND TO EXCLUDE THE PLAYERS ALREADY SELECTED
      // The backend requires full names seperated by a "-"
      const excludePlayers: string[] = selectedPlayers.map(
        (player: Player) => player.first_name + " " + player.second_name
      );
      // CALCULATE THE REMAINING POSITION LIMITS
      const numberOfElementsType = (positionId: number) =>
        selectedPlayers.filter(
          (player: Player) => player.element_type === positionId
        ).length;
      // The backend requires a string. "2-5-5-3" is the default formation.
      const formation: string = `${
        POSITION_LIMIT[1] - numberOfElementsType(1)
      }-${POSITION_LIMIT[2] - numberOfElementsType(2)}-${
        POSITION_LIMIT[3] - numberOfElementsType(3)
      }-${POSITION_LIMIT[4] - numberOfElementsType(4)}`;

      // REDUCE THE BUDGET
      const budget: number = selectedPlayers.reduce(
        (remainingBudget: number, player: Player) =>
          remainingBudget - player.now_cost,
        1000
      );

      // IF BUDGET IS LESS THAN ZERO, ABORT PROCESS
      if (budget <= 0) {
        console.log(
          "Your account balance has insufficient funds to carry out that transaction :'("
        );
        return;
      }

      // REQUEST THE OPTIMISED TEAM
      axios
        .post("api/generate", {
          exclude_players: excludePlayers,
          formation: formation,
          budget: budget,
        })
        .then((response: AxiosResponse) => {
          const generatedTeam: GeneratedPlayer[] = response.data.team;

          const expectedLength =
            15 -
            numberOfElementsType(1) -
            numberOfElementsType(2) -
            numberOfElementsType(3) -
            numberOfElementsType(4);
          if (generatedTeam.length !== expectedLength) {
            console.log(
              "Something went wrong with the calculation.\n\nMost likely, we can't fill every spot with that small a budget!"
            );
            return;
          }

          const names: string[] = generatedTeam.map(
            (generatedPlayer: GeneratedPlayer) => generatedPlayer.name
          );
          const team: Player[] = unselectedPlayers.filter((player: Player) =>
            names.includes(player.first_name + " " + player.second_name)
          );
          setSelectedPlayers((prevState: Player[]) => [...prevState, ...team]);
          setUnselectedPlayers((prevState: Player[]) =>
            prevState.filter((player: Player) => !team.includes(player))
          );
        });
    }
  };

  useEffect(() => {
    axios
      .get("/api")
      .then((response: AxiosResponse) => {
        setTeams(response.data.teams);
        setUnselectedPlayers(response.data.elements);
        setPositions(response.data.element_types);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const initialBudget = 1000;
    const spentBudget: number = selectedPlayers.reduce(
      (total: number, player: Player) => (total += player.now_cost),
      0
    );
    setBudget(initialBudget - spentBudget);
  }, [selectedPlayers]);

  useEffect(() => {
    const totalPoints: number = selectedPlayers.reduce(
      (total: number, player: Player) => (total += Number(player.ep_next)),
      0
    );
    setExpectedPoints(totalPoints);
  }, [selectedPlayers]);

  return (
    <div className="h-screen overflow-auto bg-slate-900 p-2 grid grid-cols-12">
      <div className="col-span-9">
        <Dashboard budget={budget} expectedPoints={expectedPoints} />
        <div>
          {[1, 2, 3, 4].map((i: number) => {
            return (
              <div className="h-fit">
                <PlayerCarousel
                  unselectedPlayers={unselectedPlayers.filter(
                    (player: Player) => player.element_type === i
                  )}
                  selectedPlayers={selectedPlayers.filter(
                    (player: Player) => player.element_type === i
                  )}
                  position={getPosition(i, positions)}
                  teams={teams}
                  handlePlayerSelect={handlePlayerSelect}
                  handlePlayerDeselect={handlePlayerDeselect}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="col-span-3 bg-gradient-to-r from-slate-900 to-cyan-900">
        <p className="text-2xl text-center text-zinc-50 font-light tracking-widest">
          PLAYER STATS
        </p>

        {focusedPlayer && (
          <PlayerCard
            player={focusedPlayer}
            isSelected={true}
            handlePlayerDeselect={handlePlayerDeselect}
            handlePlayerSelect={handlePlayerSelect}
          />
        )}
      </div>
      <button
        className="rounded-lg shadow-lg text-white font-extrabold text-center m-auto p-3 bg-gradient-to-tr from-emerald-500 to-blue-500 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-900"
        onClick={getOptimalTeam}
      >
        GENERATE TEAM
      </button>
    </div>
  );
}

export default App;
