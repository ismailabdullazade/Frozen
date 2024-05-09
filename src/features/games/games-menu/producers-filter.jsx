import css from "./producers-filter.module.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import dropdownTriangle from "../../../images/items/select-triangle.svg";
import clearTriangle from "../../../images/items/close_search.svg";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useGetProducersQuery } from "../../../app/api/games.api";
import { useMediaQuery } from "beautiful-react-hooks";
import GamesProvider from "../games-block/components/games-provider";
import {
  setFilters,
  setProvidersOpenedSlice,
  setSeachProvider,
} from "../game.slice";
import { isEmptyFilters } from "../../../utils/validation";

function compareWords(source, search) {
  return source
    .toLowerCase()
    .replace(/ /gi, "")
    .includes(search.toLowerCase().replace(/ /gi, ""));
}

function prepareProducers({ search, producers = [] }) {
  const filteredProducers =
    search.length > 0
      ? producers?.filter((producer) => compareWords(producer.title, search))
      : producers;

  const result = [];

  filteredProducers.forEach((val) => result.push(Object.assign({}, val)));

  return result.sort(function (a, b) {
    try {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  });
}

export default function ProducerSelector({ filtersExpanded }) {
  const [providersOpened, setProvidersOpened] = useState(false);
  const filterIsOpened = useSelector((state) => state.game.filterIsOpened);
  const filters = useSelector((state) => state.game.filters);
  const selectedProducer = useSelector(
    (state) => state.game.filters?.producer ?? ""
  );
  const { t } = useTranslation();
  const input = useRef();
  const focusListener = () => setProvidersOpened(true);
  const { data: producers } = useGetProducersQuery();
  const [search, setSearch] = useState("");
  const filteredProducers = useMemo(
    () => prepareProducers({ search, producers }),
    [producers, search]
  );
  let producersColumns = [];
  const list = useRef();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSafari =
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");
  producersColumns.push(filteredProducers ? filteredProducers : []);
  const dispatch = useDispatch();
  const filter = useSelector(
    (state) => state.game.filters ?? { section: "", title: "", producer: "" }
  );

  useEffect(() => {
    if (input && input.current && providersOpened) {
      input.current.focus();
    }
  }, [providersOpened]);

  useEffect(() => {
    if (selectedProducer.length > 0) {
      setSearch("");
    }
  }, [selectedProducer]);

  useEffect(() => {
    if (filterIsOpened === null && isEmptyFilters(filters)) {
      dispatch(setFilters({ ...filter, producer: "" }));
    }
    // eslint-disable-next-line
  }, [filterIsOpened]);

  useEffect(() => {
    if (providersOpened) {
      dispatch(setProvidersOpenedSlice(true));
    } else {
      dispatch(setProvidersOpenedSlice(false));
    }
    // eslint-disable-next-line
  }, [providersOpened]);

  useEffect(() => {
    if (!filtersExpanded) {
      setProvidersOpened(false);
    }
  }, [filtersExpanded]);

  return (
    <div className={css.producers} ref={list}>
      <div
        className={classNames(css.producers__input, {
          [css.focused]: providersOpened,
          [css.safari]: isSafari && selectedProducer.length === 0,
          [css.active]: selectedProducer.length > 0,
        })}
      >
        <div
          className={classNames(css.producers__inputContainer, {
            [css.safari]: isSafari && selectedProducer.length === 0,
          })}
        >
          <div className={css.producers__selected}>
            {(function () {
              const fullObj = producers?.find(
                (producer) => producer.external_id === selectedProducer
              );

              return (
                <div
                  className={classNames(css.producer__selected, {
                    [css.last_child]: true,
                  })}
                >
                  {fullObj?.title && (
                    <div
                      className={classNames(
                        css.producer__selectedText,
                        css.producer__selectedText__image
                      )}
                      onClick={() => {
                        setProvidersOpened(!providersOpened);
                      }}
                    >
                      <GamesProvider
                        variant="search"
                        item={fullObj?.title.toLowerCase()}
                      />
                      <span className={css.provider_title}>
                        {fullObj?.title}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            {isMobile && !providersOpened && selectedProducer.length > 1 && (
              <span className={css.producers__selectedAndMore}>
                + {selectedProducer.length - 1}
              </span>
            )}
            {selectedProducer.length > 0 ? (
              ""
            ) : (
              <input
                type="text"
                placeholder={selectedProducer.length > 0 ? "" : t("providers")}
                ref={input}
                onFocus={focusListener}
                value={search}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearch(e.target.value);
                  dispatch(setSeachProvider(e.target.value));
                }}
              />
            )}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (selectedProducer?.length) {
                dispatch(setFilters({ ...filter, producer: "" }));
                dispatch(setSeachProvider(""));
              } else {
                setProvidersOpened(!providersOpened);
              }
            }}
            className={classNames(css.producers__inputIcon, {
              [css.close]: selectedProducer?.length > 0,
            })}
          >
            {selectedProducer?.length > 0 ? (
              <img src={clearTriangle} alt="" />
            ) : (
              <img
                src={dropdownTriangle}
                alt=""
                className={classNames({ [css.flipped]: providersOpened })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
