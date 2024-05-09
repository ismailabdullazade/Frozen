import { useDispatch, useSelector } from "react-redux";
import {
  setClickLogo,
  setFilters,
  setOpenSearchGame,
  setStopGamesFilters,
} from "../../features/games/game.slice";
import css from "./search.module.css";
import Modal from "../modal/modal";
import ProducerBlock from "../producer-block/producer-block";
import Input from "../form3/input";
import CategorySelector from "../../features/games/games-menu/category-selector";
import ProducerSelector from "../../features/games/games-menu/producers-filter";
import classNames from "classnames";
import device from "../../../src/utils/detect-device";
import {
  useFetchSectionsQuery,
  useGetGamesQuery,
} from "../../app/api/games.api";
import { useTranslation } from "react-i18next";
import { useGetActiveBonusQuery } from "../../app/api/bonus.api";
import { useEffect, useState } from "react";
import { isEmptyFilters } from "../../utils/validation";
import check from "./../../images/items/checkbox_bonus.svg";
import check_checked from "./../../images/items/checkbox_bonus_checked.svg";
import close from "./../../images/items/x_close.svg";
import GamesWrapper from "../../features/games/games-wrapper/games-wrapper";
import GamesBlock from "../../features/games/games-block/games-block";
import CategoryBlock from "../category-block/category-block";
import Select from "../form3/select";
import NewCategorySelector from "../category-filter/category-filter";

export default function Search() {
  const gamesFilters = useSelector((state) => state.game.filters);
  const stopGamesFilters = useSelector((state) => state.game.stopGamesFilters);
  const filters = useSelector((state) => state.game.filters);
  const openSearchGame = useSelector((state) => state.game.openSearchGame);
  const clickLogo = useSelector((state) => state.game.clickLogo);
  const [search, setSearch] = useState("");
  const [bonusWagering, setBonusWagering] = useState(false);
  const { data: sections } = useFetchSectionsQuery();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeWager, setActiveWager] = useState();
  const deviceInfo = new device();
  const dispatch = useDispatch();
  const { data: activeBonus } = useGetActiveBonusQuery();

  useEffect(() => {
    if (activeBonus?.active_wager?.active) {
      setActiveWager(true);
    } else {
      setActiveWager(false);
    }
  }, [activeBonus?.active_wager?.active]);

  const { isFetching, data: gamesData } = useGetGamesQuery(
    {
      device: deviceInfo.type,
      page: currentPage,
      category: filters?.section,
      producer: filters?.producer,
      title: filters?.title?.length > 2 ? filters.title : null,
      per_page: 24
    },
    { skip: !openSearchGame }
  );
  const [list, setlist] = useState([]); //тут будут храниться игры, полученные через запрос /list

  useEffect(() => {
    let delayApply;

    if (!isFetching) {
      delayApply = setTimeout(() => {
        const currentFilters = {
          ...(gamesFilters ?? { section: "", title: "", producer: "" }),
        };
        dispatch(setFilters({ ...currentFilters, title: search }));
      }, 1000);
    }

    return () => clearTimeout(delayApply);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    if (gamesFilters !== null) {
      const filterTitle = gamesFilters?.title || "";
      setSearch(filterTitle);
    } else if (stopGamesFilters) {
      setSearch("");
      dispatch(setStopGamesFilters(false));
    }
    // eslint-disable-next-line
  }, [gamesFilters, stopGamesFilters]);

  useEffect(() => {
    console.log(gamesData)
    // if (gamesData) {
      setlist([]);
      setCurrentPage(1);
    // }

  }, [filters]);

  useEffect(() => {
    if (stopGamesFilters && clickLogo) {
      dispatch(setClickLogo(false));
      localStorage.removeItem("filters");
    }
    // eslint-disable-next-line
  }, [stopGamesFilters, clickLogo]);

  useEffect(() => {
    if (gamesData?.data) {
      setlist(list.concat(gamesData.data));
    }
    // eslint-disable-next-line
  }, [gamesData, gamesData?.total]);

  return (
    <Modal
      isOpen={openSearchGame}
      closeModal={() => {
        dispatch(setOpenSearchGame(false));
      }}
      theme={"search"}
    >
        <div className={classNames(css.selectbox)}>
          <div className={css.search_games}>
            <Input
              isSearch={true}
              value={search}
              onChange={setSearch}
              type={"text"}
              className={classNames(css.filters__search, {
                [css.loading]: isFetching && gamesFilters?.title?.length > 2,
              })}
              placeholder={t("Search")}
              wrapperClassName={css.searchWrapper}
            />
          </div>
          <ProducerSelector />
          <NewCategorySelector />
          <div
            className={classNames(css.bonus_wagering, {
              [css.active]: bonusWagering,
            })}
            onClick={() => {
              setBonusWagering(!bonusWagering);
            }}
          >
            <span className={css.bonus_wagering__title}>
              {t("bonus wagering")}
            </span>
            <div className={css.bonus_wagering__check}>
              <img src={bonusWagering ? check_checked : check} alt="" />
            </div>
          </div>
          <div
            className={css.close_modal}
            onClick={() => {
              dispatch(setOpenSearchGame(false));
            }}
          >
            <img src={close} alt="" />
          </div>
        </div>
      <ProducerBlock />
      <CategoryBlock activeWager={activeWager} />

      <div className="scrollbar-container">
        <div className="scrollbar-content">
          <GamesWrapper isFetching={isFetching} isUninitialized={false}>
            <GamesBlock
              games={list}
              isLoading={isFetching}
              currentPage={currentPage}
              total={gamesData?.total}
              categoryName={filters?.section}
              variant="search"
              showMoreAction={
                currentPage < gamesData?.last_page
                  ? () => setCurrentPage(currentPage + 1)
                  : null
              }
            />
          </GamesWrapper>
        </div>
      </div>
    </Modal>
  );
}
