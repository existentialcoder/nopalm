import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Space, Input, notification } from 'antd'

import './PackageExplorer.scss';

import PackageCard from './PackageCard';

import type { SearchProps } from 'antd/es/input/Search';

import { useSelector, useDispatch } from 'react-redux';

import { PackageExplorerProps, PackageProps } from '../helpers/types';

import Dataservice from '../api/Dataservice';

import { dummyPackages } from '../helpers/constants';

import { AppDispatch, RootState } from '../store/store';

import { useNotification } from './NotificationContext';

import { setIsPackageSaveLoading, setListOfNewPackagesToInstall } from '../store/slices/packages';

const { Search } = Input;

const PackageExplorer: React.FC<PackageExplorerProps> = forwardRef((props: PackageExplorerProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();

    const { notify } = useNotification();
    
    const [searchResults, setSearchResults] = useState<PackageProps[]>([]);

    const [searchResultsLoading, setSearchResultsLoading] = useState(false);

    const [searchClicked, setSearchClicked] = useState(false);

    const [emptySearchResult, setEmptySearchResult] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const listOfNewPackagesToInstall = useSelector((state: RootState) => state.package.listOfNewPackagesToInstall);

    async function callAndSetSearchResults(q: string) {
        const result = await Dataservice.searchPackages(q);

        setEmptySearchResult(result.length === 0);

        setSearchResults(result);
    }

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setSearchQuery(value);
        setSearchClicked(true);
        setSearchResultsLoading(true);

        await callAndSetSearchResults(value);

        setSearchResultsLoading(false);
    };

    function modifyListOfPackagesToInstall(packageName: string, selectedVersionToInstall?: string, isDevPackage?: boolean) {
        let clonedList = Array.from(listOfNewPackagesToInstall);

        if (selectedVersionToInstall) {
            const alreadyExistsIndex = clonedList.findIndex(pkg => pkg.name === packageName);
            if (alreadyExistsIndex >= 0) {
                // updation
                clonedList[alreadyExistsIndex] = {
                    name: packageName,
                    version_to_install: selectedVersionToInstall,
                    is_dev: isDevPackage
                };
            } else {
                // addition
                clonedList.push({
                    name: packageName,
                    version_to_install: selectedVersionToInstall,
                    is_dev: isDevPackage
                });
            }
        } else {
            // removal
            clonedList = clonedList.filter(pkg => pkg.name !== packageName);
        }

        dispatch(setListOfNewPackagesToInstall(clonedList));
    }

    const onSaveClickHandler = async () => {
        await Promise.all(listOfNewPackagesToInstall.map(
            pkg => Dataservice.installPackage(pkg.name, pkg.version_to_install || '', pkg.is_dev || false))
        );

        notify('Installed Packages', 'Successfully installed list of packages', 'success');
        dispatch(setListOfNewPackagesToInstall([]));
        dispatch(setIsPackageSaveLoading(false));
        setSearchQuery('')
    };

    const onRevertClickHandler = () => {
        dispatch(setListOfNewPackagesToInstall([]));
    };

    const onCancelClickHandler = () => {
        // reset search query, search results and list of packages to install
        setSearchQuery('');
        dispatch(setListOfNewPackagesToInstall([]));
        setSearchResults([]);
        setSearchResultsLoading(false);
        setSearchClicked(false);
        props.reRenderPackages();
    };

    useImperativeHandle(ref, () => ({
        onSaveClickHandler,
        onRevertClickHandler,
        onCancelClickHandler
    }));

    return (
        <div className="package-explorer-container">
            <Space direction="vertical">
                <Search placeholder="Search your package..." value={searchQuery}
                    disabled={listOfNewPackagesToInstall.length > 0} onChange={e => setSearchQuery(e.target.value)}
                    onSearch={onSearch} allowClear enterButton style={{ width: 950 }} />
            </Space>
            <div className="search-results-container">
                {
                    searchClicked ?
                        (searchResultsLoading && !emptySearchResult ? dummyPackages : searchResults).map(searchResult => (
                            <PackageCard
                                reRenderPackages={() => { }}
                                loading={searchResultsLoading}
                                key={searchResult.name}
                                package={searchResult}
                                installed={false}
                                versions={searchResult.versions}
                                isPackageSelectedToInstall={listOfNewPackagesToInstall.map(({ name }) => name).includes(searchResult.name)}
                                modifyListOfPackagesToInstall={modifyListOfPackagesToInstall}
                            />
                        )) : <div className="explore-more-message">
                            Explore more packages that best fits your project!
                        </div>
                }
                {
                    searchClicked && !searchResultsLoading && emptySearchResult &&
                    <div className="explore-more-message">
                        No results found! Check your search query
                    </div>
                }
            </div>
        </div>
    )
});

export default PackageExplorer;
