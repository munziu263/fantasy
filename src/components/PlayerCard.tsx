import { MouseEvent, useState } from "react";
import { Player, Position, Team } from "../types";

interface PlayerCardProps {
  player: Player;
  position?: Position;
  team?: Team;
  isSelected: boolean;
  handlePlayerSelect: (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => void;
  handlePlayerDeselect: (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => void;
}

export const PlayerCard = (props: PlayerCardProps) => {
  const imageUrlBase =
    "https://resources.premierleague.com/premierleague/photos/players/250x250/p";
  const teamShirtImageUrlBase =
    "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_";
  const teamShirtImageUrlSuffix = "-66.webp";

  const positionColor: { [position: number]: string } = {
    1: "from-slate-600 via-slate-800 to-slate-900",
    2: "from-emerald-800 via-slate-800 to-slate-900",
    3: "from-cyan-800 via-slate-800 to-slate-900",
    4: "from-blue-900 via-slate-800 to-slate-900",
  };

  const borderHoverColor: { [position: number]: string } = {
    1: "hover:border-slate-300",
    2: "hover:border-emerald-300",
    3: "hover:border-cyan-300",
    4: "hover:border-blue-300",
  };

  const borderSelectedColor: { [position: number]: string } = {
    1: "border-slate-300",
    2: "border-emerald-300",
    3: "border-cyan-300",
    4: "border-blue-300",
  };

  const shadowHoverColor: { [position: number]: string } = {
    1: "hover:shadow-slate-500",
    2: "hover:shadow-emerald-500",
    3: "hover:shadow-cyan-500",
    4: "hover:shadow-blue-900",
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>, player: Player) => {
    event.preventDefault();
    props.isSelected
      ? props.handlePlayerDeselect(event, player)
      : props.handlePlayerSelect(event, player);
  };

  return (
    <div
      className={`rounded-lg
                  bg-zinc-400
                   hover:border-2 
                  ${borderHoverColor[props.player.element_type]}
                  hover:shadow-md ${
                    shadowHoverColor[props.player.element_type]
                  } hover:shadow-blue-900 
                  overflow-hidden static
                  transition duration-700
                  hover:scale-95 hover:transition hover:duration-700
                  m-1
                  basis-1/5 shrink-0  h-fit
                  bg-gradient-to-t ${positionColor[props.player.element_type]}
                  `}
      key={props.player.code}
      onClick={(event: MouseEvent<HTMLDivElement>) =>
        handleClick(event, props.player)
      }
    >
      {/* Player Image */}
      <div className={`relative p-3`}>
        <img
          className="rounded-full m-auto bg-zinc-50/10 shadow-xl"
          src={imageUrlBase + props.player.photo.replace(".jpg", ".png")}
          alt={
            props.player.web_name.length >= 3
              ? props.player.web_name.substring(0, 3) + "..."
              : props.player.web_name
          }
          loading="lazy"
          // onError={(event: any) => {
          //   event.target.src = props.team
          //     ? teamShirtImageUrlBase +
          //       props.team.code +
          //       teamShirtImageUrlSuffix
          //     : "";
          //   event.onError = null;
          // }}
        />
        <p className="text-zinc-50 sm:text-xs font-bold absolute top-0 left-0 p-2">
          {props.team && props.team.short_name}
        </p>
        <p className=" text-zinc-50 sm:text-xs font-bold absolute top-0 right-0 p-2">
          {`£${(props.player.now_cost / 10).toFixed(1)}`}
        </p>
        <div className="sm:text-xs absolute bottom-0 left-0 text-center m-auto text-zinc-50 p-2">
          <p className="font-bold">{props.player.ict_index_rank}</p>
          <p className=" sm:hidden text-center text-zinc-50">RANK</p>
        </div>
        <div className="sm:text-xs absolute bottom-0 right-0 text-center m-auto text-zinc-50 p-2">
          <p className="font-bold">{props.player.ep_next}</p>
          <p className="sm:hidden text-center text-zinc-50">EP</p>
        </div>
      </div>

      {/* Player Details */}
      <div className="text-center sm:text-xs">
        <p className={"text-zinc-300"}>
          {props.position && props.position.singular_name_short.toUpperCase()}
        </p>
        <p className="text-zinc-50 sm:text-sm font-bold">
          {props.player.web_name.length >= 9
            ? props.player.web_name.substring(0, 9) + "..."
            : props.player.web_name}
        </p>
      </div>

      {/* Player stats */}
    </div>
  );
};
