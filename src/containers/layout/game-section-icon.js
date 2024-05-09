import React from "react";
import { ReactComponent as Lobby } from "../../images/games/lobby.svg";
import { ReactComponent as LiveGames } from "../../images/games/live_games.svg";
import { ReactComponent as LiveGamesBig } from "../../images/games/live_games_big.svg";
import { ReactComponent as Favorites } from "../../images/games/favorite_games.svg";
import { ReactComponent as Bonuses } from "../../images/games/bonuses.svg";
import { ReactComponent as BonusBuy } from "../../images/games/bonus_buy.svg";
import { ReactComponent as BonusBuySmall } from "../../images/games/bonus_buy_small.svg";
import { ReactComponent as AllGames } from "../../images/games/all_games.svg";
import { ReactComponent as AllGamesSmall } from "../../images/games/all_games_small.svg";
import { ReactComponent as Popular } from "../../images/games/popular.svg";
import { ReactComponent as PopularSmall } from "../../images/games/popular_small.svg";
import { ReactComponent as NewGames } from "../../images/games/new_games.svg";
import { ReactComponent as NewGamesSmall } from "../../images/games/new_games_small.svg";
import { ReactComponent as Support } from "../../images/games/support.svg";
import { ReactComponent as ThemeSmall } from "../../images/games/themes_small.svg";
import { ReactComponent as LastSmall } from "../../images/games/last_played_small.svg";
import { ReactComponent as BonusesSmall } from "../../images/games/bonuses_small.svg";
import { ReactComponent as TounamentsSmall } from "../../images/games/tournaments_small.svg";
import { ReactComponent as JackpotSmall } from "../../images/games/jackpot_small.svg";
import { ReactComponent as SlotsSmall } from "../../images/games/slots_small.svg";

export default function GameSectionIcon({ id }) {
  switch (id) {
    case "lobby":
      return <Lobby />;
    case "favorites":
      return <Favorites />;
    case "live_games":
      return <LiveGames />;
    case "live_games_big":
      return <LiveGamesBig />;
    case "bonuses":
      return <Bonuses />;
    case "bonus_buy":
      return <BonusBuy />;
    case "bonus_buy_small":
      return <BonusBuySmall />;
    case "all_games":
      return <AllGames />;
    case "all_games_small":
      return <AllGamesSmall />;
    case "popular":
      return <Popular />;
    case "popular_small":
      return <PopularSmall />;
    case "new_games":
      return <NewGames />;
    case "new_games_small":
      return <NewGamesSmall />;
    case "support":
      return <Support />;
    case "theme_small":
      return <ThemeSmall />;
    case "last_small":
      return <LastSmall />;
    case "bonuses_small":
      return <BonusesSmall />;
    case "tournaments_small":
      return <TounamentsSmall />;
    case "jackpot_small":
      return <JackpotSmall />;
    case "slots_small":
      return <SlotsSmall />;
    default:
      return <svg></svg>;
  }
}
