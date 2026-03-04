import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ChartDataPoint, TimeRange } from '@/types/coin';
import { fetchChartData } from '@/lib/coingecko';

interface ChartState {
  data: ChartDataPoint[];
  timeRange: TimeRange;
  loading: boolean;
  error: string | null;
}

const initialState: ChartState = {
  data: [],
  timeRange: '7',
  loading: false,
  error: null,
};

export const getChartData = createAsyncThunk(
  'chart/getChartData',
  async ({ id, days }: { id: string; days: string }) => {
    return fetchChartData(id, days);
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setTimeRange(state, action) {
      state.timeRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChartData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getChartData.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(getChartData.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to fetch chart'; });
  },
});

export const { setTimeRange } = chartSlice.actions;
export default chartSlice.reducer;
