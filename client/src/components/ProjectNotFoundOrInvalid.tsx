import { Alert, Button, Empty } from 'antd';

import React from 'react';

import { EmptyProjectStateTypes } from '../helpers/types';

const ProjectNotFoundOrInvalid: React.FC<{ type: EmptyProjectStateTypes, createNewProjectHandler: () => void }> = (props) => {
    const newProjectConsentMessage = `Node project is not found in the current directory!
    Click on create new project to start spinning one from scratch`,
        notEmptyDirMessage = `Current directory do not seem to be empty.
        Rerun it either in an empty directory or a valid node project`;

    return (
        <Empty
            image={props.type === 'not_found' ? Empty.PRESENTED_IMAGE_DEFAULT : false}
            description={
                props.type === 'not_found' ?
                    newProjectConsentMessage :
                    <Alert type='error' style={{ width: '58%', margin: 'auto' }} showIcon={true} description={notEmptyDirMessage} />
            }>
            {
                props.type === 'not_found' && <Button type={"primary"} onClick={() => { props.createNewProjectHandler(); }}>
                    Create new
                </Button>
            }
        </Empty>
    )
};

export default ProjectNotFoundOrInvalid;
