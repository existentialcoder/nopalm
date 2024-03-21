import React from "react";

export type Option = {
    value: string,
    label: string,
    questions?: QuestionObject []
};

export type QuestionObject = {
    question: string,
    question_name: string,
    logo_name?: string,
    options: Option []
};

export interface QuestionProps {
    questionObj: QuestionObject;
    answerHandler: (value: string, options: any, questionName: string) => void;
};

export interface PackageProps {
    name: string,
    latest_version: string,
    description: string,
    homepage: string,
    logo: string,
    versions: string[]
}

export interface InstalledPackageProps extends PackageProps{
    installed_version?: string,
    is_dev?: boolean
};

interface PackageExplorerPropsInterface {
    projectName: string,
    projectDescription: string,
    reRenderPackages: Function,
    setIsPackagesSaveLoading: Function
};

export interface PackageExplorerRef {
    onSaveClickHandler: () => void,
    onRevertClickHandler: () => void,
    onCancelClickHandler: () => void
};

export type PackageExplorerProps = PackageExplorerPropsInterface & React.RefAttributes<PackageExplorerRef>

export interface PackageCardProps {
    loading: boolean,
    reRenderPackages: Function,
    package: InstalledPackageProps,
    installed: boolean,
    versions: string[],
    isPackageSelectedToInstall?: boolean,
    modifyListOfPackagesToInstall: Function,
};

export interface ProjectDetailsProps {
    name: string,
    description: string
};

export interface PackageToInstallProps {
    name: string,
    version_to_install?: string,
    is_dev?: boolean
};
