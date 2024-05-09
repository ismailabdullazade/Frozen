import GamesWrapper from "../games-wrapper/games-wrapper";
import { returnScrollPosition } from "../../../components/scrollbar/scrollbar";
import React, { useEffect, useState } from "react";
import { useGetGamesQuery } from "../../../app/api/games.api";
import device from "../../../utils/detect-device";
import { useParams } from "react-router-dom";
import GamesBlock from "../games-block/games-block";

export default function GamesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const deviceInfo = new device();
  const parameters = {
    device: deviceInfo.type,
    page: currentPage,
    per_page: 28,
    // provider: selectedProvider?.external_id
  };
  if (params?.section !== "all_games") {
    parameters.category = params?.section;
  }
  const { isFetching, isUninitialized, error, data } =
    useGetGamesQuery(parameters);
  const [list, setList] = useState(false);
  const savedPage = parseInt(localStorage.getItem("pageSection"));

  useEffect(() => {
    if ((data || error) && (!savedPage || isNaN(savedPage))) {
      window.closeSplash();
    }
    if (data) {
      if (currentPage > 1 && list) {
        setList([...list, ...data.data]);
      } else {
        setList(data.data);
      }
    }
  }, [data, error]);

  useEffect(() => {
    if (!isNaN(savedPage) && savedPage !== currentPage) {
    } else {
      setCurrentPage(1);
    }
  }, [params?.section]);

  useEffect(() => {
    if (!isNaN(savedPage) && savedPage !== currentPage && !isFetching) {
      setCurrentPage(currentPage + 1);
    }
    if (!isNaN(savedPage) && savedPage === currentPage && !isFetching) {
      localStorage.removeItem("pageSection");
      returnScrollPosition();
      window.closeSplash();
    }
  }, [currentPage, isFetching]);

  return (
    <GamesWrapper
      isFetching={isFetching && currentPage === 1}
      isUninitialized={isUninitialized}
    >
      {((!isFetching && currentPage === 1) || currentPage !== 1) &&
        !isUninitialized &&
        !error &&
        list && (
          <GamesBlock
            games={list}
            sliceFor="section"
            isLoading={isFetching}
            currentPage={currentPage}
            categoryName={params?.section}
            showMoreAction={
              currentPage < data.last_page
                ? () => setCurrentPage(currentPage + 1)
                : null
            }
          />
        )}
    </GamesWrapper>
  );
}
