import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Coin, CoinDetail } from '@/types/coin';
import { fetchCoins, fetchCoinDetail } from '@/lib/coingecko';

interface CoinsState {
  list: Coin[];
  detail: CoinDetail | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: CoinsState = {
  list: [],
  detail: null,
  loading: false,
  detailLoading: false,
  error: null,
};

export const getCoins = createAsyncThunk('coins/getCoins', async (page: number = 1) => {
  return fetchCoins(page);
});

export const getCoinDetail = createAsyncThunk('coins/getCoinDetail', async (id: string) => {
  return fetchCoinDetail(id);
});

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoins.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getCoins.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(getCoins.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch coins'; })
      .addCase(getCoinDetail.pending, (state) => { state.detailLoading = true; })
      .addCase(getCoinDetail.fulfilled, (state, action) => { state.detailLoading = false; state.detail = action.payload; })
      .addCase(getCoinDetail.rejected, (state, action) => { state.detailLoading = false; state.error = action.error.message ?? 'Failed to fetch coin'; });
  },
});

export const { clearDetail } = coinsSlice.actions;
export default coinsSlice.reducer;
