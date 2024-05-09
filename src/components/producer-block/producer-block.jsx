import { useEffect, useMemo, useState } from "react";
import GamesProvider from "../../features/games/games-block/components/games-provider";
import css from "./producer-block.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useGetProducersQuery } from "../../app/api/games.api";
import classNames from "classnames";
import { setFilters } from "../../features/games/game.slice";
import { useTranslation } from "react-i18next";

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

export default function ProducerBlock({ filtersExpanded }) {
  const providersOpened = useSelector(
    (state) => state.game.providersOpenedSlice
  );
  const selectedProducer = useSelector(
    (state) => state.game.filters?.producer ?? ""
  );
  const search = useSelector((state) => state.game.seachProvider);
  const [notProviders, setNotProviders] = useState(false);
  const { data: producers } = useGetProducersQuery();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filteredProducers = useMemo(
    () => prepareProducers({ search, producers }),
    [producers, search]
  );
  let producersColumns = [];
  producersColumns.push(filteredProducers ? filteredProducers : []);
  const filter = useSelector(
    (state) => state.game.filters ?? { section: "", title: "", producer: "" }
  );

  useEffect(() => {
    if (producersColumns[0].length > 0) {
      setNotProviders(false);
    } else {
      setNotProviders(true);
    }
    // eslint-disable-next-line
  }, [producersColumns[0].length]);

  return (
    <div
      className={classNames(css.background, { [css.open]: providersOpened })}
    >
      <>
        {producersColumns.map((column, i) => (
          <div
            key={`column-${i}`}
            className={classNames(css.wraper, {
              [css.not_providers]: notProviders,
            })}
          >
            {notProviders ? (
              <span className={css.text_notProviders}>
                {t("no providers found")}
              </span>
            ) : (
              <>
                {producers &&
                  column.map((producer) => (
                    <div
                      className={classNames(css.card, {
                        [css.selected]: selectedProducer.includes(
                          producer?.external_id
                        ),
                      })}
                      key={`producer-${producer?.id}`}
                      onClick={() => {
                        if (selectedProducer?.includes(producer?.external_id)) {
                          dispatch(setFilters({ ...filter, producer: "" }));
                        } else {
                          dispatch(
                            setFilters({
                              ...filter,
                              producer: producer.external_id,
                            })
                          );
                        }
                      }}
                    >
                      <GamesProvider
                        key={producer.external_id}
                        variant="producer-block"
                        item={producer.title.toLowerCase()}
                      />
                    </div>
                  ))}
              </>
            )}
          </div>
        ))}
      </>
    </div>
  );
}
