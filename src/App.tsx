import { useEffect, useState, MouseEvent } from "react";
import axios, { AxiosResponse } from "axios";
import "./App.css";
import { Team, Player, Position } from "./types";
import { PlayerCard } from "./components/PlayerCard";
import {
  getPosition,
  getTeam,
  getPlayer,
  getPlayerPosition,
  getPlayerTeam,
  getTeamPlayers,
  getPositionPlayers,
  bestPlayerBy,
  filteredPlayersBy,
  cheapestXPlayersForWhom,
} from "./queries/queries";
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
  });
  useEffect(() => {
    const totalPoints: number = selectedPlayers.reduce(
      (total: number, player: Player) => (total += Number(player.ep_next)),
      0
    );
    setExpectedPoints(totalPoints);
  });
  useEffect(() => {});

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
    </div>
  );
}

export default App;
