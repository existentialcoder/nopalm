import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import NewProjectTour from '../components/NewProjectTour';

import './ProjectDetails.scss';

import { Button, FormInstance } from 'antd';

import { AppDispatch, RootState } from '../store/store';

import { fetchAndSetProjectDetails, saveProjectDetails, setIsProjectSaveLoading, setNewProjectDetails, setShouldShowSaveButton } from '../store/slices/project';

import { useNotification } from '../components/NotificationContext';

import ProjectDetailsForm from '../components/ProjectDetailsForm';

const ProjectDetails: React.FC = () => {
    const shouldShowSaveButton = useSelector((state: RootState) => state.project.shouldShowSaveButton);

    const isProjectSaveLoading = useSelector((state: RootState) => state.project.isProjectSaveLoading);

    const isNewProject = useSelector((state: RootState) => state.project.isNewProject);

    const projectDetails = useSelector((state: RootState) => state.project.projectDetails);

    const [projectDetailsFormInstances, setProjectDetailsFormInstances] = useState<FormInstance[]>([]);

    const { notify } = useNotification();

    const dispatch = useDispatch<AppDispatch>();

    async function projectSaveHandler() {
        try {
            await Promise.all(
                projectDetailsFormInstances.map(formInstance => formInstance.validateFields())
            );

            dispatch(setIsProjectSaveLoading(true));

            await dispatch(saveProjectDetails(notify));

            if (isNewProject) {
                dispatch(setNewProjectDetails({}));
            }

            dispatch(fetchAndSetProjectDetails());
        } catch (ex) {
            // no-op
        }
    }

    useEffect(() => {
        dispatch(setShouldShowSaveButton(false));
        dispatch(fetchAndSetProjectDetails());
    }, []);

    return (
        <div className='project-details-container'>
            <div className='project-details-title'>
                {isNewProject && Object.keys(projectDetails).length === 0 ? 'Create new project' : 'Project Details'}
                {
                    (!isNewProject || shouldShowSaveButton) && <Button type={'primary'} loading={isProjectSaveLoading}
                        onClick={projectSaveHandler}>
                        {isProjectSaveLoading ? 'Saving' : 'Save'}
                    </Button>
                }
            </div>
            {
                isNewProject && Object.keys(projectDetails).length === 0 ? <NewProjectTour setFormInstances={setProjectDetailsFormInstances} />
                : <ProjectDetailsForm setFormInstances={setProjectDetailsFormInstances} />
            }
        </div>
    )
};

export default ProjectDetails;
