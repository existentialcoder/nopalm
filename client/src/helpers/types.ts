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
}

export interface InstalledPackageProps {
    name: string,
    installed_version: string,
    latest_version: string,
    description: string,
    homepage: string,
    logo: string,
    is_dev: boolean
}

export interface PackageCardProps {
    loading: boolean,
    reRenderPackages: Function,
    package: InstalledPackageProps
}
