export interface PackageManager {
    name: string;
    file: string;
}

export interface Meta {
    settings: {
        package_manager: string;
    };
}

export interface LoggerStream {
    push: (message: unknown) => void;
    pipe: <T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }) => T;
}

export type LogLevel = 'info' | 'error' | 'warn' | 'debug';

export interface WrapStreamerFunction {
    (message: string, ...splat: unknown[]): void;
}

export interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    private?: boolean;
    license?: string;
    author?: string | { name: string; email?: string };
    keywords?: string[];
    homepage?: string;
    bugs?: string | { url: string };
    repository?: string | { type: string; url: string };
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
}

export interface Package {
    name?: string;
    version?: string;
    isDev?: boolean;
    latest?: boolean;
}

export type PackageOperationType = 'install' | 'uninstall' | 'upgrade' | 'install_all';

export interface NpmPackageData {
    name: string;
    description?: string;
    homepage?: string;
    'dist-tags': { latest: string; [tag: string]: string };
    versions: Record<string, unknown>;
    [key: string]: unknown;
}

export interface SearchResult {
    package: {
        name: string;
        description?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface DependencyResult {
    name: string;
    latest_version: string;
    description: string;
    homepage: string;
    logo: string;
    versions: string[];
}

export interface InstalledPackageResult extends DependencyResult {
    installed_version: string;
    is_dev: boolean;
}

export interface AppearanceSettings {
    mode: string;
    accent_color: string;
}

export interface PreferencesSettings {
    package_manager: string;
    log_level: LogLevel;
}

export interface Settings {
    appearance: AppearanceSettings;
    preferences: PreferencesSettings;
}

export interface ProjectSetupDetails {
    type_of_app: string;
    linter: string;
    ts_preference: boolean;
    cli_utility_package: string;
    type_of_web_app: string;
    frontend_framework: string;
    frontend_build_tool: string;
    unit_test_framework: string;
    web_server_framework: string;
    database: string;
    orm: string;
}

export interface PackageJsonDetails {
    name: string;
    homepage: string;
    bugs: string;
    author: string;
    repository: string;
    keywords: string[];
    description: string;
    private: boolean;
    license: string;
}

export interface NewProjectDetails {
    packageJsonDetails: PackageJsonDetails;
    projectSetupDetails: ProjectSetupDetails;
}

export interface NewProjectBody {
    name?: string;
    homepage?: string;
    bugs?: string;
    author?: string;
    repository?: string;
    keywords?: string[];
    description?: string;
    private?: boolean;
    license?: string;
    type_of_app?: string;
    linter?: string;
    ts_preference?: string;
    cli_utility_package?: string;
    type_of_web_app?: string;
    frontend_framework?: string;
    frontend_build_tool?: string;
    unit_test_framework?: string;
    web_server_framework?: string;
    database?: string;
    orm?: string;
}
