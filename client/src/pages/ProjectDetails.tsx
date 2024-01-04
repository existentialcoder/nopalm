import React, { useEffect, useState } from "react";

import Dataservice from '../api/Dataservice.ts';

import './ProjectDetails.scss';

import { Flex, Button, Form } from 'antd';

const ProjectDetails: React.FC = () => {
    const [ isNewProject, setIsNewProject ] = useState(false);
    const [ consentedForNewProject, setConsentedForNewProject ] = useState(false);
    const [ projectDetails, setProjectDetails ] = useState({});

    const renderNewProjectView = () => {
        return (
            <div className="new-project-consent">
                Node project is not found in the current directory!
                Click on create new project to start spinning one from scratch
                <div className="consent-btn-group">
                    <Flex gap="medium" wrap="wrap" justify="center" style={{ margin: "10px" }}>
                        <Button type={"primary"} onClick={() => setConsentedForNewProject(true)}>
                            Create new
                        </Button>
                    </Flex>
                </div>
            </div>
        )
    };

    const renderProjectForm = () => {
        return (
            <div className="project-form-container">
                <Form>

                </Form>
            </div>
        );
    }

    const shouldRenderForm = () => !isNewProject || consentedForNewProject;

    useEffect(() => {
        Dataservice.getProjectDetails()
            .then(setProjectDetails)
    }, []);

    return (
        <div className="project-details-container">
            {
                Object.keys(projectDetails).length !== 0 ? renderNewProjectView() : ''
            }
            {
                shouldRenderForm() ? renderProjectForm() : ''
            }
        </div>
    )
};

export default ProjectDetails;
