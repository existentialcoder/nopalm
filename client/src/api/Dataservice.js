const BASE_URL = process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_API_BASE_URL}/api` : '/api';

const request = async (url, options) => {
  const response = (await fetch(url, options)).json();
  return response;
};

const Dataservice = {
  async getPackageManagers () {
    const url = `${BASE_URL}/package-managers`;

    return request(url, { method: 'GET' });
  },
  async getInstalledPackages () {
    const url = `${BASE_URL}/packages/installed`;

    return request(url, { method: 'GET' });
  },
  async installPackage (packageDetails) {
    const url = `${BASE_URL}/packages/installed`;

    return request(url, {
      method: 'POST',
      body: JSON.stringify({ package: packageDetails })
    });
  },
  async uninstallPackage (packageDetails) {
    const url = `${BASE_URL}/packages/installed`;

    return request(url, {
      method: 'DELETE',
      body: JSON.stringify({ package: packageDetails })
    });
  }
};

export default Dataservice;
