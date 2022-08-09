import { MouseEvent } from "react";
import { getPlayerTeam } from "../queries/queries";
import { Player, Position, Team } from "../types";
import { PlayerCard } from "./PlayerCard";

interface PlayerCarouselProps {
  unselectedPlayers: Player[];
  selectedPlayers: Player[];
  position?: Position;
  teams: Team[];

  handlePlayerSelect: (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => void;
  handlePlayerDeselect: (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => void;
}

export const PlayerCarousel = (props: PlayerCarouselProps) => {
  const positionColor: { [position: number]: string } = {
    1: "from-slate-300/40",
    2: "from-emerald-300/40",
    3: "from-cyan-300/40",
    4: "from-blue-300/40",
  };

  return (
    <div
      className={`
                 bg-slate-900
                 flex flex-row justify-between
                  my-2`}
    >
      <div
        className={`bg-zinc-50/10 border-r rounded-lg xs:basis-16 sm:basis-1/12 flex`}
      >
        <div className="text-base text-zinc-50 font-extrabold m-auto">
          <p className="text-center">
            {props.position && props.position.plural_name_short}
          </p>
          <p className="text-2xl sm:text-xl text-center">
            {props.selectedPlayers &&
              "£" +
                props.selectedPlayers.reduce(
                  (totalCost: number, currentPlayer: Player) =>
                    (totalCost += currentPlayer.now_cost / 10),
                  0.0
                ) +
                "M"}
          </p>
        </div>
      </div>
      <div
        className={`border-b rounded-l-xl bg-gradient-to-r ${
          props.position && positionColor[props.position.id]
        }
                    basis-5/12 flex flex-row
        `}
      >
        {props.selectedPlayers &&
          props.selectedPlayers
            .sort((a: Player, b: Player) => a.ict_index_rank - b.ict_index_rank)
            .map((player: Player) => (
              <PlayerCard
                player={player}
                position={props.position}
                team={getPlayerTeam(player, props.teams)}
                isSelected={true}
                key={"player-" + player.code}
                handlePlayerSelect={props.handlePlayerSelect}
                handlePlayerDeselect={props.handlePlayerDeselect}
              />
            ))}
        {/* {props.position &&
          [...Array(POSITION_LIMIT[props.position.id])].map((element) => (
            <div className="mx-2 shrink-0 bg-zinc-50/30 rounded-lg "></div>
          ))} */}
      </div>
      <div className="basis-5/12 flex flex-row overflow-x-auto">
        {props.unselectedPlayers &&
          props.unselectedPlayers
            .sort((a: Player, b: Player) => a.ict_index_rank - b.ict_index_rank)
            .map((player: Player) => (
              <PlayerCard
                player={player}
                position={props.position}
                team={getPlayerTeam(player, props.teams)}
                isSelected={false}
                key={"player-" + player.code}
                handlePlayerSelect={props.handlePlayerSelect}
                handlePlayerDeselect={props.handlePlayerDeselect}
              />
            ))}
      </div>
    </div>
  );
};
