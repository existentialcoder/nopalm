import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as colors from '@ant-design/colors';

import { AccentColors, SettingsResultProps } from '../../helpers/types';

import Dataservice from '../../api/Dataservice';

type AppRoute = 'project_details' | 'packages' | 'settings';

interface AppState {
  currentActiveRoute: AppRoute,
  globalSettings: SettingsResultProps | {},
  isMainLoading: Boolean,
  isDark: Boolean,
  selectedPrimaryColor: AccentColors | ''
};

const initialState: AppState = {
  globalSettings: {},
  isDark: false,
  selectedPrimaryColor: '',
  currentActiveRoute: 'project_details',
  isMainLoading: false
};

export const fetchAndSetGlobalSettings = createAsyncThunk('app/fetchAndSetGlobalSettings', async () => {
  const settings = await Dataservice.getSettings('global');

  return settings;
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentActiveRoute(state, action) {
      state.currentActiveRoute = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetGlobalSettings.fulfilled, (state, action) => {
      const settings = action.payload;

      state.globalSettings = settings;

      state.isDark =
        (settings.appearance.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
        settings.appearance.mode === 'dark';
      
      const accentColor = settings.appearance.accent_color as AccentColors;

      const primaryColor = (Object.values(AccentColors).includes(accentColor)
          ? (colors[accentColor]?.primary as AccentColors) // Ensure type alignment
          : "") || ""; // Fallback to an empty string

      state.selectedPrimaryColor = primaryColor;
      
      state.isMainLoading = false;
    });
    builder.addCase(fetchAndSetGlobalSettings.pending, (state) => {
      state.isMainLoading = true;
    });
    builder.addCase(fetchAndSetGlobalSettings.rejected, (state) => {
      state.isMainLoading = false;
    });
  },
});

export const { setCurrentActiveRoute } = appSlice.actions;

export default appSlice.reducer;

