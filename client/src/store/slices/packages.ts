import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import Dataservice from '../../api/Dataservice';

import { InstalledPackageProps, PackageToInstallProps } from '../../helpers/types';

interface PackageState {
	installedPackages: InstalledPackageProps[],
	packagesLoading: boolean,
	isEmptyPackageList: boolean,
	isPackageSaveLoading: boolean,
	listOfNewPackagesToInstall: PackageToInstallProps[]
};

const initialState: PackageState = {
	installedPackages: [],
	packagesLoading: true,
	isEmptyPackageList: false,
	isPackageSaveLoading: false,
	listOfNewPackagesToInstall: []
};

export const fetchAndSetInstalledPackages = createAsyncThunk('packages/fetchAndSetInstalledPackages', async () => {
	const packages = await Dataservice.getInstalledPackages();

	return packages;
});

const packageSlice = createSlice({
	name: 'package',
	initialState,
	reducers: {
		setIsPackageSaveLoading: (state, action) => {
			state.isPackageSaveLoading = action.payload;
		},
		setListOfNewPackagesToInstall: (state, action) => {
			state.listOfNewPackagesToInstall = action.payload;
		},
		setPackagesLoading: (state, action) => {
			state.packagesLoading = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAndSetInstalledPackages.fulfilled, (state, action) => {
			const packages = action.payload;

			if (packages?.length === 0) {
				state.isEmptyPackageList = true;
			}

			state.installedPackages = packages;

			state.packagesLoading = false;
		});
	},
});

export const { setIsPackageSaveLoading, setPackagesLoading, setListOfNewPackagesToInstall } = packageSlice.actions;

export default packageSlice.reducer;
