import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import type { AdCategory, AdLayout, SortColumn, SortDirection } from '@/entities/ad/model/types';

type AdsUiState = {
  page: number;
  search: string;
  categories: AdCategory[];
  needsRevisionOnly: boolean;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  layout: AdLayout;
};

const initialState: AdsUiState = {
  page: 1,
  search: '',
  categories: [],
  needsRevisionOnly: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
  layout: 'grid',
};

const adsUiSlice = createSlice({
  name: 'adsUi',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    toggleCategory(state, action: PayloadAction<AdCategory>) {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter((item) => item !== category);
      } else {
        state.categories.push(category);
      }
      state.page = 1;
    },
    setNeedsRevisionOnly(state, action: PayloadAction<boolean>) {
      state.needsRevisionOnly = action.payload;
      state.page = 1;
    },
    setSorting(
      state,
      action: PayloadAction<{ sortColumn: SortColumn; sortDirection: SortDirection }>,
    ) {
      state.sortColumn = action.payload.sortColumn;
      state.sortDirection = action.payload.sortDirection;
      state.page = 1;
    },
    setLayout(state, action: PayloadAction<AdLayout>) {
      state.layout = action.payload;
    },
    resetFilters(state) {
      state.search = '';
      state.categories = [];
      state.needsRevisionOnly = false;
      state.sortColumn = 'createdAt';
      state.sortDirection = 'desc';
      state.page = 1;
    },
  },
});

export const {
  setPage,
  setSearch,
  toggleCategory,
  setNeedsRevisionOnly,
  setSorting,
  setLayout,
  resetFilters,
} = adsUiSlice.actions;

export const adsUiReducer = adsUiSlice.reducer;

export const selectAdsUi = (state: RootState) => state.adsUi;
