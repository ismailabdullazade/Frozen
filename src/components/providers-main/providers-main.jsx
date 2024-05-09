import css from "./providers-main.module.css";
import arrow from "./../../images/games/themes/arrow_main_left.svg";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProducersQuery } from "../../app/api/games.api";
import GamesProvider from "../../features/games/games-block/components/games-provider";
import { useMediaQuery } from "beautiful-react-hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { setFilters } from "../../features/games/game.slice";
import providers from "./../../images/games/index/providers.svg";

function compareWords(source, search) {
  return source
    .toLowerCase()
    .replace(/ /gi, "")
    .includes(search.toLowerCase().replace(/ /gi, ""));
}

function prepareProducers({ search, producers = [] }) {
  const filteredProducers =
    search?.length > 0
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

export default function ProvidersMain({ variant }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1280px)");
  const selectedProducer = useSelector(
    (state) => state.game.filters?.producer ?? ""
  );
  const search = useSelector((state) => state.game.seachProvider);
  const [main, setMain] = useState();
  const [notProviders, setNotProviders] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  // eslint-disable-next-line
  const [totalSlides, setTotalSlides] = useState(0);
  const { data: producers } = useGetProducersQuery();
  const dispatch = useDispatch();
  const filteredProducers = useMemo(
    () => prepareProducers({ search, producers }),
    [producers, search]
  );
  const filter = useSelector(
    (state) => state.game.filters ?? { section: "", title: "", producer: "" }
  );

  let producersColumns = [];
  producersColumns.push(filteredProducers ? filteredProducers : []);
  const slide = isMobile ? 2 : isTablet ? 5 : 21;
  const swiperRef = useRef(null);

  useEffect(() => {
    if (variant === "main") {
      setMain(true);
    } else {
      setMain(false);
    }
  }, [variant]);

  useEffect(() => {
    if (producersColumns[0].length > 0) {
      setNotProviders(false);
    } else {
      setNotProviders(true);
    }
    // eslint-disable-next-line
  }, [producersColumns[0].length]);

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      setSwiper(swiperInstance);

      swiperInstance.on("slideChange", () => {
        setCurrentSlideIndex(swiperInstance.activeIndex);
        setIsEnd(swiperInstance.isEnd);
      });

      swiperInstance.on("reachEnd", () => {
        setIsEnd(true);
      });

      swiperInstance.on("reachBeginning", () => {
        setIsEnd(false);
      });

      setTotalSlides(swiperInstance.slides.length);
    }
    // eslint-disable-next-line
  }, [swiperRef.current, main]);

  function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array?.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  const goPrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const goNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className={css.providers_main}>
      <div className={css.block_title}>
        <div className={css.title_block__wraper}>
          <div className={css.iconWrapper}>
            <img src={providers} className={css.game_svg} alt="" />
          </div>
          <span>{t("providers")}</span>
        </div>
        <div className={css.block_batton}>
          <div
            className={classNames(css.batton_left, {
              [css.disabled]: currentSlideIndex === 0,
            })}
            onClick={goPrev}
          >
            <img src={arrow} alt="" />
          </div>
          <div
            className={classNames(css.batton_right, {
              [css.disabled]: isEnd,
            })}
            onClick={goNext}
          >
            <img src={arrow} alt="" />
          </div>
        </div>
      </div>
      <Swiper ref={swiperRef}>
        {chunkArray(filteredProducers, slide).map((group, groupIndex) => (
          <SwiperSlide key={`group-${groupIndex}`}>
            <div
              className={classNames(css.block_providers, {
                [css.not_providers]: notProviders,
              })}
            >
              {group.map((producer) => (
                <div
                  className={classNames(css.card, {
                    [css.selected]: selectedProducer?.includes(
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
                    item={producer?.title.toLowerCase()}
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
