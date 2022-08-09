import { Player, Position, Team } from "../types";
import {
  getPlayer,
  getTeam,
  getPosition,
  getTeamPlayers,
  getPlayerTeam,
  getPlayerPosition,
  getPositionPlayers,
  bestPlayerBy,
  filteredPlayersBy,
  cheapestXPlayersForWhom,
  generateTeam,
} from "./queries";
import * as data from "../sample-data.json";

test("getPlayer returns the correct player", () => {
  // GIVEN an id and a list of player,
  const id: number = 1;
  const players: Player[] = data.elements;

  // WHEN I call the getPlayer function,
  const player: Player | undefined = getPlayer(id, players);

  // THEN I should have the correct player.
  expect(player).toBeDefined();
  expect(player?.id).toStrictEqual(id);
});

test("getTeam returns the correct team", () => {
  // GIVEN an id and a list of teams,
  const id: number = 1;
  const teams: Team[] = data.teams;

  // WHEN I call the getTeam function,
  const team: Team | undefined = getTeam(id, teams);

  // THEN I should have the correct team.
  expect(team).toBeDefined();
  expect(team?.id).toStrictEqual(id);
});

test("getPosition returns the correct position", () => {
  // GIVEN an id and a list of teams,
  const id: number = 1;
  const positions: Position[] = data.element_types;

  // WHEN I call the getPosition function,
  const position: Position | undefined = getPosition(id, positions);

  // THEN I should have the correct position.
  expect(position).toBeDefined();
  expect(position?.id).toStrictEqual(id);
});

test("getTeamPlayers returns a list of players from the correct team", () => {
  // GIVEN a team and a list of players,
  const team: Team = data.teams[0];
  const players: Player[] = data.elements;

  // WHEN I call the getTeamPlayers function,
  const teamPlayers: Player[] = getTeamPlayers(team, players);

  // THEN I should have a list of players from that team.
  expect(teamPlayers.length).toBeGreaterThan(0);
  expect(teamPlayers.every((player: Player) => player.team === team.id)).toBe(
    true
  );
});

test("getPlayerTeam returns the correct team for that player", () => {
  // GIVEN a player and a list of teams,
  const player: Player = data.elements[0];
  const teams: Team[] = data.teams;

  // WHEN I call the getPlayerTeam function,
  const team: Team | undefined = getPlayerTeam(player, teams);

  // THEN I should have the team which that player is in.
  expect(team).toBeDefined();
  expect(team?.id).toStrictEqual(player.team);
});

test("getPlayerPosition returns that players correct position", () => {
  // GIVEN a player and a list of positions,
  const player: Player = data.elements[0];
  const positions: Position[] = data.element_types;

  // WHEN when I call the getPlayerPosition function,
  const position: Position | undefined = getPlayerPosition(player, positions);

  // THEN I should have a position with the correct id.
  expect(position).toBeDefined();
  expect(position?.id).toStrictEqual(player.element_type);
});

test("getPositionPlayers returns a list of players who play that position", () => {
  // GIVEN a position and a list of players,
  const position: Position = data.element_types[0];
  const players: Player[] = data.elements;

  // WHEN I call the getPositionPlayers function,
  const positionPlayers: Player[] = getPositionPlayers(position, players);

  // THEN I should have a list of players who play that position.
  expect(positionPlayers.length).toBeGreaterThan(0);
  expect(
    positionPlayers.every(
      (player: Player) => player.element_type === position.id
    )
  ).toBe(true);
});

test("bestPlayerBy should return the (best) player with the maximum value for that parameter", () => {
  // GIVEN a parameter, list of players, and an ordering,
  const parameter: keyof Player = "creativity_rank";
  const players: Player[] = data.elements;
  const ordering: (a: Player, b: Player) => number = (a, b) =>
    b[parameter] - a[parameter];

  // WHEN I call bestPlayerBy,
  const bestPlayer: Player | undefined = bestPlayerBy(
    parameter,
    players,
    ordering
  );

  // THEN I should have the (best) player who has the maximum value for that parameter.
  expect(bestPlayer).toBeDefined();
  expect(bestPlayer[parameter]).toStrictEqual(
    Math.max(...players.map((player: Player) => player[parameter]))
  );
});

test("filterPlayersBy should return a list of players that match the predicate", () => {
  // GIVEN a list of players and a predicate,
  const parameter: keyof Player = "creativity_rank";
  const predicate: (player: Player) => boolean = (player) =>
    player[parameter] < 20;
  const players: Player[] = data.elements;

  // WHEN when I call filterPlayerBy,
  const filteredPlayers: Player[] = filteredPlayersBy(players, predicate);

  // THEN I should receive a list of players that match that predicate.
  expect(filteredPlayers.length).toBeGreaterThan(0);
  expect(filteredPlayers.every(predicate)).toBe(true);
});

test("cheapestXPlayersForWhom should return the (best) cheapest player who matches the predicate", () => {
  // GIVEN a quantity (x: int), a predicate and a list of players,
  const quantity: number = 10;
  const predicate: (player: Player) => boolean = (player) =>
    player.ict_index_rank < 50;
  const players: Player[] = data.elements;

  // WHEN I call cheapestPlayerForWhom,
  const cheapestPlayers: Player[] = cheapestXPlayersForWhom(
    quantity,
    predicate,
    players
  );

  // THEN I should receive a list with length x of the cheapest players who match that predicate
  expect(cheapestPlayers).toBeDefined();
  expect(cheapestPlayers).toHaveLength(quantity);
  expect(cheapestPlayers.every(predicate)).toBe(true);
});

test("generateTeam should return a list of players that match the fantasy rules", () => {
  // GIVEN  a list of players and an optional budget
  const players: Player[] = data.elements;
  const selectedPlayers: Player[] = data.elements.slice(0, 3);
  const budget: number = 100; // the budget per the rules is 100M

  // WHEN   I call generateTeam
  const generatedTeam: Player[] = generateTeam(
    selectedPlayers,
    players,
    budget
  );

  // THEN   I should have a list of players
  expect(generatedTeam.length).toBeGreaterThan(0);
  //        with 2 Goalkeepers, 5 defenders, 5 midfielders, and 3 forwards,
  expect(
    generatedTeam.filter((player: Player) => player.element_type === 1)
  ).toHaveLength(2);
  expect(
    generatedTeam.filter((player: Player) => player.element_type === 2)
  ).toHaveLength(5);
  expect(
    generatedTeam.filter((player: Player) => player.element_type === 3)
  ).toHaveLength(5);
  expect(
    generatedTeam.filter((player: Player) => player.element_type === 4)
  ).toHaveLength(3);
  //        with a total cost less or equal to than the budget
  expect(
    generatedTeam.reduce(
      (sum: number, player: Player) => sum + player.now_cost,
      0
    )
  ).toBeLessThanOrEqual(budget * 10);
  //        and with no more than 3 players from the same team
  const teamCounter: { [teamId: number]: number } = generatedTeam
    .map((player: Player) => player.team)
    .reduce((count: { [teamId: number]: number }, team: number) => {
      if (count.hasOwnProperty(team)) {
        count[team]++;
      } else {
        count[team] = 1;
      }
      return count;
    }, {});
  const counts = Object.values(teamCounter);
  expect(Math.max(...counts)).toBeLessThanOrEqual(3);
});
