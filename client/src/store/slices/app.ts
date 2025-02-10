import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as colors from '@ant-design/colors';

import { AccentColors, AppearanceModes, LogLevels, PackageManagers, SettingsResultProps } from '../../helpers/types';

import Dataservice from '../../api/Dataservice';

type AppRoute = 'project_details' | 'packages' | 'settings';

interface AppState {
  currentActiveRoute: AppRoute,
  globalSettings: SettingsResultProps,
  isMainLoading: boolean,
  isDark: boolean,
  selectedPrimaryColor: string
}

const initialState: AppState = {
  globalSettings: {
    appearance: {
      mode: AppearanceModes.light,
      accent_color: AccentColors.cyan
    },
    preferences: {
      package_manager: PackageManagers.npm,
      log_level: LogLevels.info
    }
  },
  isDark: false,
  selectedPrimaryColor: AccentColors.cyan,
  currentActiveRoute: 'project_details',
  isMainLoading: false
};

export const fetchAndSetGlobalSettings = createAsyncThunk('app/fetchAndSetGlobalSettings', async () => {
  const settings = await Dataservice.getSettings('global');

  return settings;
});

export const updateGlobalSettings = createAsyncThunk('app/updateGlobalSettings', async (settingsToUpdate: SettingsResultProps) => {
  const result = await Dataservice.updateSettings('global', settingsToUpdate);

  return result.status === 200;
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

      state.selectedPrimaryColor = colors[accentColor].primary || '';

      state.isMainLoading = false;
    }).addCase(fetchAndSetGlobalSettings.pending, (state) => {
      state.isMainLoading = true;
    }).addCase(fetchAndSetGlobalSettings.rejected, (state) => {
      state.isMainLoading = false;
    });
  },
});

export const { setCurrentActiveRoute } = appSlice.actions;

export default appSlice.reducer;

