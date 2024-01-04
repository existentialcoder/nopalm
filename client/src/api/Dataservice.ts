// Testing
const API_BASE_URL = 'http://localhost:8001/api';

// Actual
// const API_BASE_URL = '/api'

async function getProjectDetails(): Promise<Object> {
    const urlPath = 'project';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`);

    const { project } = await result.json();

    return project;
}

const Dataservice = {
    getProjectDetails
};

export default Dataservice;
