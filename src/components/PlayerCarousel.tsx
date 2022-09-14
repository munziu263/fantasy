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

  const POSITION_LIMIT: { [position: number]: number } = {
    1: 2,
    2: 5,
    3: 5,
    4: 3,
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
        className={`border-b rounded-l-xl bg-gradient-to-r 
                  ${props.position && positionColor[props.position.id]}
                    basis-5/12 flex flex-row p-1
        `}
      >
        {props.selectedPlayers &&
          props.selectedPlayers
            .sort(
              (a: Player, b: Player) => Number(b.ep_next) - Number(a.ep_next)
            )
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
        {props.position &&
          [
            ...Array(
              POSITION_LIMIT[props.position.id] -
                props.selectedPlayers.filter(
                  (player: Player) => player.element_type === props.position?.id
                ).length
            ),
          ].map((element: any) => (
            <div className="basis-1/5 flex-shrink-0 m-1 bg-gradient-to-t from-zinc-50/10 via-transparent border-b rounded-lg "></div>
          ))}
      </div>
      <div className="basis-5/12 p-1 flex flex-row overflow-x-auto">
        {props.unselectedPlayers &&
          props.unselectedPlayers
            .sort(
              (a: Player, b: Player) => Number(b.ep_next) - Number(a.ep_next)
            )
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
