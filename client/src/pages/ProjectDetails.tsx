import React, { useEffect, useMemo, useState } from "react";

import Dataservice from '../api/Dataservice.ts';

import { useSelector, useDispatch } from 'react-redux';

import {
    setIsNewProject,
    setProjectDetails,
    RootState,
    AppDispatch,
} from '../store';

import NewProjectTour from '../components/NewProjectTour';

import './ProjectDetails.scss';

import { useLocation } from 'react-router-dom';

import { Button } from "antd";


function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

const ProjectDetails: React.FC = () => {
    const [isEmptyDir, setIsEmptyDir] = useState(false);
    const [defaults, setDefaults] = useState({});
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const {
        isNewProject,
    } = useSelector((state: RootState) => state);

    const newProjectTourStepChangeHandler = (stepIndex: number) => {
        // Show Save button only for the second page in the new form
        setShowSaveButton(stepIndex === 1);
    };

    useEffect(() => {
        async function setInitialFlags() {
            const { project, isEmptyDir, defaults } = await Dataservice.getProjectDetails();

            dispatch(setIsNewProject(Object.keys(project).length === 0));
            dispatch(setProjectDetails(project));
            setDefaults(defaults);
            setIsEmptyDir(isEmptyDir);
        }

        setInitialFlags();
    }, []);

    return (
        <div className='project-details-container'>
            <div className='project-details-title'>
                {isNewProject && isEmptyDir ? 'Create new project' : 'Project Details'}
                {
                    (!isNewProject || showSaveButton) && <Button type={"primary"} loading={isSaveLoading} onClick={() => setSaveClicked(true)}>
                        { isSaveLoading ? 'Saving' : 'Save' }
                    </Button>
                }
            </div>
            {
                isNewProject && <NewProjectTour />
            }
        </div>
    )
};

export default ProjectDetails;
