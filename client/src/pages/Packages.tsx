import React, { useEffect, useRef, useState } from 'react';

import { Flex, Button, Modal, Empty } from 'antd';

import { useDispatch, useSelector } from 'react-redux';

import './Packages.scss';

import { useNavigate } from 'react-router-dom';

import PackageCard from '../components/PackageCard';

import { PackageExplorerRef } from "../helpers/types";

import PackageExplorer from '../components/PackageExplorer';

import { dummyPackages } from '../helpers/constants';

import ProjectNotFoundOrInvalid from '../components/ProjectNotFoundOrInvalid';

import { AppDispatch, RootState } from '../store/store';

import { fetchAndSetProjectDetails } from '../store/slices/project';

import { fetchAndSetInstalledPackages, setIsPackageSaveLoading, setPackagesLoading } from '../store/slices/packages';

import { setCurrentActiveRoute } from '../store/slices/app';

const Packages: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const installedPackages = useSelector((state: RootState) => state.package.installedPackages);

    const packagesLoading = useSelector((state: RootState) => state.package.packagesLoading);

    const isEmptyPackageList = useSelector((state: RootState) => state.package.isEmptyPackageList);

    const isPackagesSaveLoading = useSelector((state: RootState) => state.package.isPackageSaveLoading);

    const emptyProjectStateType = useSelector((state: RootState) => state.project.emptyProjectStateType);

    const [isPackageExplorerModalOpen, setPackageExplorerModalOpen] = useState(false);

    const packageExplorerRef = useRef<PackageExplorerRef>(null);

    function fetchAndSetPackageAndProject() {
        // Always dispatch API calls to keep it up to date since changes can be external from app as well
        dispatch(fetchAndSetProjectDetails());

        if (emptyProjectStateType === '') {
            dispatch(fetchAndSetInstalledPackages());
        }
    }

    useEffect(fetchAndSetPackageAndProject, []);

    return (
        <div className="packages-container">
            <div className="title-container">
                Installed Packages
                {
                    emptyProjectStateType === '' && <Button type={"primary"} onClick={() => setPackageExplorerModalOpen(true)}>
                        {installedPackages.length === 0 && isEmptyPackageList ? 'Explore' : 'Add more'}
                    </Button>
                }
            </div>
            {
                emptyProjectStateType === '' ? <React.Fragment>
                    <Modal title="Package Explorer"
                        open={isPackageExplorerModalOpen} width={1000} style={{ minHeight: 430, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
                        footer={[
                            <Button key="revert" disabled={isPackagesSaveLoading} type="default" onClick={() => packageExplorerRef.current?.onRevertClickHandler()}>
                                Revert
                            </Button>,
                            <Button key="save" type="primary" loading={isPackagesSaveLoading}
                                onClick={() => { dispatch(setIsPackageSaveLoading(true)); packageExplorerRef.current?.onSaveClickHandler() }}>
                                Save
                            </Button>
                        ]}
                        onCancel={() => { setPackageExplorerModalOpen(false); packageExplorerRef.current?.onCancelClickHandler() }}>
                        <PackageExplorer
                            ref={packageExplorerRef}
                            reRenderPackages={
                                () => {
                                    dispatch(setPackagesLoading(true));
                                    dispatch(fetchAndSetInstalledPackages());
                                }
                            } />
                    </Modal>
                    <div className="packages-list">
                        {installedPackages.length === 0 && isEmptyPackageList && (
                            <div className="no-packages-container">
                                <Empty description='No packages found to be installed. Explore more and install.' />
                            </div>
                        ) ||
                            (installedPackages.length > 0 ? installedPackages : dummyPackages).map(installedPackage => (
                                <PackageCard
                                    reRenderPackages={() => {
                                        dispatch(setPackagesLoading(true));
                                        dispatch(fetchAndSetInstalledPackages());
                                    }}
                                    loading={packagesLoading}
                                    key={installedPackage.name}
                                    package={installedPackage}
                                    installed={true}
                                    versions={[]}
                                    modifyListOfPackagesToInstall={() => { }}
                                />
                            ))}
                    </div>
                </React.Fragment> : <ProjectNotFoundOrInvalid type={emptyProjectStateType} createNewProjectHandler={
                    () => {
                        dispatch(setCurrentActiveRoute('project_details'));
                        navigate('project_details');
                    }} />
            }
        </div>
    )
};

export default Packages;
