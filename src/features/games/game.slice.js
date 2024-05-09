import { createSlice } from "@reduxjs/toolkit";
import { isEmptyFilters } from "../../utils/validation";

const initialState = {
  game: null,
  filterIsOpened: JSON.parse(localStorage.getItem("filterIsOpened")),
  plaseHolderInputProduserFilter: false,
  clickLogo: false,
  openSearchGame: false,
  filters: JSON.parse(localStorage.getItem("filters")) || null,
  stopGamesFilters: false,
  providersOpenedSlice: false,
  showCategoryBlockSlice:false,
  seachProvider: "",
  selectedProducer: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame(state, action) {
      state.game = action.payload;
    },
    setFiltersOpened(state, action) {
      state.filterIsOpened = action.payload;
      if (action.payload) {
        localStorage.setItem("filterIsOpened", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("filterIsOpened");
      }
    },
    setPlaseHolderInputProduserFilter(state, action) {
      state.plaseHolderInputProduserFilter = action.payload;
    },
    setClickLogo(state, action) {
      state.clickLogo = action.payload;
    },
    setOpenSearchGame(state, action) {
      state.openSearchGame = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
      if (action.payload && !isEmptyFilters(action.payload)) {
        localStorage.setItem("filters", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("filters");
      }
    },
    setStopGamesFilters(state, action) {
      state.stopGamesFilters = action.payload;
    },
    setProvidersOpenedSlice(state, action) {
      state.providersOpenedSlice = action.payload;
    },
    setShowCategoryBlockSlice(state, action) {
      state.showCategoryBlockSlice = action.payload;
    },

    setSeachProvider(state, action) {
      state.seachProvider = action.payload;
    },
    setSelectedProducer(state, action) {
      state.selectedProducer = action.payload;
    },
  },
});

export const {
  setGame,
  setFiltersOpened,
  setPlaseHolderInputProduserFilter,
  setClickLogo,
  setOpenSearchGame,
  setFilters,
  setStopGamesFilters,
  setProvidersOpenedSlice,
  setShowCategoryBlockSlice,
  setSeachProvider,
  setSelectedProducer,
} = gameSlice.actions;
export default gameSlice.reducer;
