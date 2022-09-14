import { Player } from "../types";
import { Team } from "../types";
import { Position } from "../types";

export const getTeam = (id: number, teams: Team[]) => {
  return teams.find((team: Team) => team.id === id);
};

export const getPosition = (id: number, positions: Position[]) => {
  return positions.find((position: Position) => position.id === id);
};

export const getPlayer = (id: number, players: Player[]) => {
  return players.find((player: Player) => player.id === id);
};

export const getTeamPlayers = (team: Team, players: Player[]) => {
  return players.filter((player: Player) => player.team === team.id);
};

export const getPlayerTeam = (player: Player, teams: Team[]) => {
  return teams.find((team: Team) => team.id === player.team);
};

export const getPlayerPosition = (player: Player, positions: Position[]) => {
  return positions.find(
    (position: Position) => position.id === player.element_type
  );
};

export const getPositionPlayers = (position: Position, players: Player[]) => {
  return players.filter(
    (player: Player) => player.element_type === position.id
  );
};

export const bestPlayerBy = (
  parameter: keyof Player,
  players: Player[],
  ordering: (a: Player, b: Player) => number
) => {
  const bestPlayers: Player[] = players.filter(
    (player: Player) => player[parameter]
  );
  const sortedPlayers: Player[] = bestPlayers.sort(ordering);
  return sortedPlayers[0];
};

export const filteredPlayersBy = (
  players: Player[],
  predicate: (player: Player) => boolean
) => {
  return players.filter(predicate);
};

export const cheapestXPlayersForWhom = (
  quantity: number,
  predicate: (a: Player) => boolean,
  players: Player[]
) => {
  return players
    .filter(predicate)
    .sort((a: Player, b: Player) => a.now_cost - b.now_cost)
    .slice(0, quantity);
};
