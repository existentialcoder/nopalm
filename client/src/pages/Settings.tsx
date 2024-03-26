import React, { useState } from 'react';

import { Collapse, Tooltip, Select, theme } from 'antd';

import { DarkModeSwitch } from 'react-toggle-dark-mode';

import { LaptopOutlined } from '@ant-design/icons';

import './Settings.scss';

import AccentColorPicker from '../components/AccentColorPicker';

import { SettingsResultProps, AppearanceModes, PackageManagers, LogLevels } from '../helpers/types';

import Dataservice from '../api/Dataservice';

function darkModeEnabled(settings) {
    return (settings.appearance.mode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
        settings.appearance.mode === 'dark';
}

const Appearance = (props: { settings: SettingsResultProps, reflectUpdatedUserSettings: () => void }) => {
    const [selectedAccentColor, setSelectedAccentColor] = useState<string>(props.settings.appearance.accent_color);

    const { token } = theme.useToken();

    const [isDarkMode, toggleDarkMode] = useState(darkModeEnabled(props.settings));

    const [appearanceModeSelected, setAppearanceModeSelected] = useState<AppearanceModes>(props.settings.appearance.mode);

    async function appearanceModeChangeHandler(input: boolean | 'system') {
        if (input === 'system' && appearanceModeSelected === 'system') {
            return;
        }

        const appearanceModeToBeUpdated = input === 'system' ? 'system' : (input === true ? 'dark' : 'light');

        setAppearanceModeSelected(appearanceModeToBeUpdated);

        if (input !== 'system') {
            toggleDarkMode(input);
        }

        const settingsToUpdate = {
            ...props.settings
        };

        settingsToUpdate.appearance.mode = appearanceModeToBeUpdated;

        setTimeout(async () => {
            await Dataservice.updateSettings('global', settingsToUpdate);

            props.reflectUpdatedUserSettings();
        }, 100); // wait for one tenth a second for the toggle animation
    }

    async function handleAccentColorChange(accentColor: string) {
        setSelectedAccentColor(accentColor);

        const settingsToUpdate = {
            ...props.settings
        };

        settingsToUpdate.appearance.accent_color = accentColor;

        await Dataservice.updateSettings('global', settingsToUpdate);

        props.reflectUpdatedUserSettings();
    }

    return (
        <React.Fragment>
            <div className='setting-container'>
                <div className="setting-title">
                    Choose the mode
                </div>
                <div className='appearance-choices'>
                    <Tooltip title='Light / Dark mode'>
                        <DarkModeSwitch
                            checked={isDarkMode}
                            onChange={appearanceModeChangeHandler}
                            sunColor='#FDB813'
                            moonColor={'#fff'}
                            size={30}
                        />
                    </Tooltip>
                    <Tooltip title='System default'>
                        <div className='system-theme'>
                            <LaptopOutlined
                                onClick={() => appearanceModeChangeHandler('system')}
                                style={{ fontSize: 30, color: appearanceModeSelected === 'system' ? token.colorPrimary : '' }} />
                        </div>
                    </Tooltip>
                </div>
            </div>

            <div className='setting-container'>
                <div className="setting-title">
                    Choose the accent color
                </div>
                <div className='appearance-choices'>
                    <Tooltip title='Ligth / Dark mode'>
                        <AccentColorPicker
                            onColorChange={handleAccentColorChange}
                            selectedAccentColor={selectedAccentColor}
                        />
                    </Tooltip>
                </div>
            </div>
        </React.Fragment>
    )
};

const Preferences = (props: { settings: SettingsResultProps, reflectUpdatedUserSettings: () => void }) => {
    const [selectedPackageManager, setSelectedPackageManager] = useState<PackageManagers>(props.settings.preferences.package_manager);

    const [selectedLogLevel, setSelectedLogLevel] = useState<LogLevels>(props.settings.preferences.log_level);

    async function packageManagerChangeHandler(input: PackageManagers) {
        setSelectedPackageManager(input);

        const settingsToUpdate = {
            ...props.settings
        };

        settingsToUpdate.preferences.package_manager = input;

        await Dataservice.updateSettings('global', settingsToUpdate);

        props.reflectUpdatedUserSettings();
    }

    async function logLevelChangeHandler(input: LogLevels) {
        setSelectedLogLevel(input);

        const settingsToUpdate = {
            ...props.settings
        };

        settingsToUpdate.preferences.log_level = input;

        await Dataservice.updateSettings('global', settingsToUpdate);

        props.reflectUpdatedUserSettings();
    }

    return (
        <React.Fragment>
            <div className='setting-container'>
                <div className="setting-title">
                    Choose the preferred package manager
                </div>
                <div className='appearance-choices'>
                    <Tooltip title="Applies for all the future projects">
                        <Select
                            style={{ width: 90 }}
                            defaultValue={selectedPackageManager}
                            options={[PackageManagers.npm, PackageManagers.yarn]
                                .map(key => ({ label: key, value: key }))}
                            onSelect={packageManagerChangeHandler}
                        />
                    </Tooltip>
                </div>
            </div>

            <div className='setting-container'>
                <div className="setting-title">
                    Choose the logging level
                </div>
                <div className='appearance-choices'>
                    <Tooltip title="Restart once log level is changed to help in debugging">
                        <Select
                            style={{ width: 90 }}
                            defaultValue={selectedLogLevel}
                            options={[
                                LogLevels.info, LogLevels.debug,
                                LogLevels.error, LogLevels.warn
                            ].map(key => ({ label: key, value: key }))}
                            onSelect={logLevelChangeHandler}
                        />
                    </Tooltip>
                </div>
            </div>
        </React.Fragment>
    )
};

const settingsSections = ({ settings, reflectUpdatedUserSettings }) => ([
    {
        key: 'appearance',
        label: 'Appearance',
        children: <Appearance settings={settings} reflectUpdatedUserSettings={reflectUpdatedUserSettings} />
    },
    {
        key: 'project_preferences',
        label: 'Project Preferences',
        children: <Preferences settings={settings} reflectUpdatedUserSettings={reflectUpdatedUserSettings} />
    }
]);

const Settings: React.FC<{ settings: SettingsResultProps, reflectUpdatedUserSettings: () => void }> = (props) => {
    return (
        <div className="settings-container">
            <div className="title-container">
                Settings
            </div>
            <div className='settings-box'>
                <Collapse defaultActiveKey={['appearance', 'project_preferences']}
                    items={settingsSections(props)} />
            </div>
        </div>
    )
};

export default Settings;
