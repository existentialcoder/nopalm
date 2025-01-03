import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import Dataservice from '../../api/Dataservice';

import { EmptyProjectStateTypes, NotificationType, NewProjectDefaults, NewProjectDetailsProps, ProjectDetailsProps, ProjectDirectory } from '../../helpers/types';

import { RootState } from '../store';

interface ProjectState {
	projectDetails: ProjectDetailsProps,
	emptyProjectStateType: EmptyProjectStateTypes,
	newProjectDefaults: NewProjectDefaults,
	shouldShowSaveButton: boolean,
	isProjectSaveLoading: boolean,
	isNewProject: boolean,
	newProjectDetails: NewProjectDetailsProps,
	allProjectDirectoryPaths: ProjectDirectory[],
	currentProjectDirectoryPath: string
};

const newProjectDefaults = {
	name: '',
	homepage: '',
	bugs: '',
	author: '',
	repository: ''
};

const initialState: ProjectState = {
	projectDetails: {},
	emptyProjectStateType: '',
	newProjectDefaults,
	shouldShowSaveButton: false,
	isProjectSaveLoading: false,
	isNewProject: false,
	newProjectDetails: {},
	allProjectDirectoryPaths: [],
	currentProjectDirectoryPath: ''
};

export const fetchAndSetProjectDetails = createAsyncThunk<
	{ project: ProjectDetailsProps, isEmptyDir: boolean, defaults: NewProjectDefaults, allProjectDirectories: ProjectDirectory[] },
	void,
	{ state: RootState }
>(
	'project/fetchAndSetProjectDetails',
	async (_, { getState }) => {
		const state = getState();

		const projectDetails = await Dataservice.getProjectDetails(state.project.currentProjectDirectoryPath);
	
		return projectDetails;
	}
);

type NotifyFunctionType = (message: string, description: string, type: NotificationType) => void;

export const saveProjectDetails = createAsyncThunk<
	{ result: boolean, notify: NotifyFunctionType },
	NotifyFunctionType,
	{ state: RootState }
>('project/saveProjectDetails', async (notify, { getState }) => {
	const state = getState();

	const currentProjectDirectoryPath = state.project.currentProjectDirectoryPath;

	const projectDetailsToSave = state.project.isNewProject ? state.project.newProjectDetails : state.project.projectDetails;

	const projectSaveMethod = state.project.isNewProject ? Dataservice.createNewProject : Dataservice.updateProject;

	const result = await projectSaveMethod(currentProjectDirectoryPath, projectDetailsToSave);

	return { result, notify };
});

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		setShouldShowSaveButton: (state, action) => {
			state.shouldShowSaveButton = action.payload;
		},
		setNewProjectDetails: (state, action) => {
			state.newProjectDetails = action.payload;
		},
		setProjectDetails: (state, action) => {
			state.projectDetails = action.payload;
		},
		setIsProjectSaveLoading: (state, action) => {
			state.isProjectSaveLoading = action.payload;
		},
		setCurrentProjectDirectoryPath: (state, action) => {
			state.currentProjectDirectoryPath = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAndSetProjectDetails.fulfilled, (state, action) => {
			const { project, isEmptyDir, defaults, allProjectDirectories } = action.payload;

			if (Object.keys(project).length === 0) {
				state.emptyProjectStateType = isEmptyDir ? 'not_found' : 'invalid';

				const isNewProject = state.emptyProjectStateType === 'not_found';

				state.isNewProject = isNewProject;

				state.projectDetails = {};

				if (defaults) {
					state.newProjectDefaults = defaults;
				}
			} else {
				debugger;
				state.projectDetails = project;
				state.isNewProject = false;
				state.emptyProjectStateType = '';
				state.newProjectDefaults = {};
				state.allProjectDirectoryPaths = allProjectDirectories;
			}
		}).addCase(saveProjectDetails.fulfilled, (state, action) => {
			state.isProjectSaveLoading = false;

			const isSaveSuccessful = action.payload.result;

			const notify = action.payload.notify;

			const successTitle = state.isNewProject ? 'Created new project' : 'Updated project',
				successMessage = state.isNewProject ? 'Succesfully created new node project. Check your current working directory' : 'Successfully updated project. Check your current working directory',
				errorTitle = state.isNewProject ? 'Error creating new project' : 'Error updating project',
				errorMessage = state.isNewProject ? 'Error creating new project. Please check the debug logs' : 'Error updating new project. Please check the debug logs';

			notify(
				isSaveSuccessful ? successTitle : errorTitle,
				isSaveSuccessful ? successMessage : errorMessage,
				isSaveSuccessful ? 'success' : 'error'
			);
		});
	},
});

export const { setShouldShowSaveButton, setProjectDetails, setNewProjectDetails, setIsProjectSaveLoading, setCurrentProjectDirectoryPath } = projectSlice.actions;

export default projectSlice.reducer;
