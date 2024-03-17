import React, { useEffect, useState } from "react";

import { Flex, Button } from 'antd';

import './Packages.scss';

import PackageCard from '../components/PackageCard';

import Dataservice from '../api/Dataservice';

import { InstalledPackageProps } from "../helpers/types";

const dummyPackages: InstalledPackageProps[] = [
    {
        name: 'dummy',
        installed_version: '1.0.0',
        latest_version: '1.0.0',
        description: 'dummt',
        homepage: 'dummy',
        logo: 'dummy',
        is_dev: false
    },
    {
        name: 'dummy1',
        installed_version: '1.0.0',
        latest_version: '1.0.0',
        description: 'dummt',
        homepage: 'dummy',
        logo: 'dummy',
        is_dev: false
    },
    {
        name: 'dummy2',
        installed_version: '1.0.0',
        latest_version: '1.0.0',
        description: 'dummt',
        homepage: 'dummy',
        logo: 'dummy',
        is_dev: false
    },
    {
        name: 'dummy3',
        installed_version: '1.0.0',
        latest_version: '1.0.0',
        description: 'dummt',
        homepage: 'dummy',
        logo: 'dummy',
        is_dev: false
    }
];

const Packages: React.FC = () => {
    const [installedPackages, setInstalledPackages] = useState<InstalledPackageProps[]>([]);

    const [packagesLoading, setPackagesLoading] = useState(true);

    const [emptyPackageList, setEmptyPackageList] = useState(false);


    async function setInitialFlags() {
        const packages = await Dataservice.getInstalledPackages();

        if (packages.length === 0) {
            setEmptyPackageList(true);
        }

        setInstalledPackages(packages);
        setPackagesLoading(false);
    }

    useEffect(() => {
        setInitialFlags();
    }, []);

    const reRenderPackages = () => {
        setTimeout(() => setInitialFlags(), 2000);
    };

    return (
        <div className="packages-container">
            <div className="title-container">
                Installed Packages
            </div>
            <div className="packages-list">
                {installedPackages.length === 0 && emptyPackageList && (
                    <div className="no-packages-container"> No packages installed.
                        <div className="consent-btn-group">
                            <Flex gap="medium" wrap="wrap" justify="center" style={{ margin: "10px" }}>
                                <Button type={"primary"} onClick={() => {}}>
                                    Explore
                                </Button>
                            </Flex>
                        </div>
                    </div>
                ) ||
                    (installedPackages.length > 0 ? installedPackages : dummyPackages).map(installedPackage => (
                        <PackageCard
                            reRenderPackages={reRenderPackages}
                            loading={packagesLoading}
                            key={installedPackage.name}
                            package={installedPackage}
                        />
                    ))}
            </div>

        </div>
    )
};

export default Packages;
