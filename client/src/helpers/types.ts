import React from "react";

export enum PackageManagers {
    yarn = 'yarn',
    npm = 'npm'
}

export enum AppearanceModes {
    light = 'light',
    dark = 'dark',
    system = 'system'
}

export enum LogLevels {
    info = 'info',
    debug = 'debug',
    error = 'error',
    warn = 'warn'
}

export enum AccentColors {
    red = 'red',
    volcano = 'volcano',
    orange = 'orange',
    gold = 'gold',
    yellow = 'yellow',
    lime = 'lime',
    green = 'green',
    cyan = 'cyan',
    blue = 'blue',
    purple = 'purple',
    magenta = 'magenta',
    geekblue = 'geekblue'
}

export type EmptyProjectStateTypes = '' | 'not_found' | 'invalid';

type AppearanceSettings = {
    mode: AppearanceModes,
    accent_color: AccentColors
};

type PreferenceSettings = {
    package_manager: PackageManagers,
    log_level: LogLevels
};

export interface SettingsResultProps {
    appearance: AppearanceSettings,
    preferences: PreferenceSettings
}

export type Option = {
    value: string,
    label: string,
    questions?: QuestionObject[]
};

export type QuestionObject = {
    question: string,
    tooltip_message?: string,
    type: 'select' | 'switch',
    question_name: string,
    logo_name?: string,
    options: Option[]
};

export interface QuestionProps {
    questionObj: QuestionObject | undefined;
    answer: string,
    answerHandler: (value: string, options: any, questionName: string) => void;
}

export interface PackageProps {
    name: string,
    latest_version: string,
    description: string,
    homepage: string,
    logo: string,
    versions: string[]
}

export interface InstalledPackageProps extends PackageProps {
    installed_version?: string,
    is_dev?: boolean
}

interface PackageExplorerPropsInterface {
    reRenderPackages: () => void,
}

export interface PackageExplorerRef {
    onSaveClickHandler: () => void,
    onRevertClickHandler: () => void,
    onCancelClickHandler: () => void
}

export type PackageExplorerProps = PackageExplorerPropsInterface & React.RefAttributes<PackageExplorerRef>

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface PackageCardProps {
    loading: boolean,
    reRenderPackages: () => void,
    package: InstalledPackageProps,
    installed: boolean,
    versions: string[],
    isPackageSelectedToInstall?: boolean,
    modifyListOfPackagesToInstall: (packageName: string, selectedVersionToInstall?: string | undefined, isDevPackage?: boolean | undefined) => void
}

export interface ProjectDetailsProps {
    name?: string,
    description?: string,
    private?: boolean,
    keywords?: string[],
    repository?: string,
    homepage?: string,
    bugs?: string,
    license?: string,
    author?: string
}

export interface PackageToInstallProps {
    name: string,
    version_to_install?: string,
    is_dev?: boolean
}

export interface AccentColorPickerProps {
    selectedAccentColor: string,
    onColorChange: (accentColor: AccentColors) => void
}

export interface NewProjectTourProps {
    isEmptyDir: boolean,
    defaults: ProjectDetailsProps,
    setIsSaveLoading: (arg: boolean) => void,
    newProjectTourStepChangeHandler: (inp: number) => void,
    consentedForNewProject: boolean
}


export interface NewProjectDefaults {
    name?: string,
    homepage?: string,
    bugs?: string,
    author?: string,
    repository?: string
};

export interface NewProjectDetailsProps extends NewProjectDefaults {
    type_of_app?: string,
    cli_utility_package?: string,
    linter?: string,
    ts_preference?: boolean,
    frontend_framework?: string,
    frontend_build_tool?: string,
    web_server_framework?: string,
    database?: string,
    orm?: string
}

export type NewProjectQuestion = keyof NewProjectDetailsProps;

export interface ProjectDetailsFormProps {
    projectDetails: ProjectDetailsProps
}

interface FormFieldOption {
    label: string,
    value: string
}

export interface FormFieldProps {
    name: string,
    label: string,
    type: 'input' | 'select' | 'textarea' | 'switch',
    placeholder?: string,
    hint?: string,
    required?: boolean,
    tags?: boolean,
    options?: FormFieldOption[],
    multiple?: boolean,
    addon_before?: string,
    max_length?: number
}
