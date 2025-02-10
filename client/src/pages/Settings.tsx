import React, { useState } from 'react';

import { Collapse, Tooltip, Select, theme, Checkbox } from 'antd';

import { DarkModeSwitch } from 'react-toggle-dark-mode';

import { useDispatch, useSelector } from 'react-redux';

import { LaptopOutlined } from '@ant-design/icons';

import './Settings.scss';

import AccentColorPicker from '../components/AccentColorPicker';

import { PackageManagers, LogLevels, SettingsResultProps, AccentColors, AppearanceModes } from '../helpers/types';

import { AppDispatch, RootState } from '../store/store';

import { fetchAndSetGlobalSettings, updateGlobalSettings } from '../store/slices/app';

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const settings = useSelector((state: RootState) => state.app.globalSettings);

    const isDarkMode = useSelector((state: RootState) => state.app.isDark);

    const selectedPrimaryColor = useSelector((state: RootState) => state.app.selectedPrimaryColor);

    const [collapseAllSettings, setCollapseAllSettings] = useState(false);

    const appearanceModeSelected = settings.appearance.mode;

    const selectedPackageManager = settings.preferences.package_manager;

    const selectedLogLevel = settings.preferences.log_level;

    const settingsUpdateOperations = async (settingsToUpdate: SettingsResultProps) => {
        await dispatch(updateGlobalSettings(settingsToUpdate));

        dispatch(fetchAndSetGlobalSettings());
    };

    const Appearance = () => {
        const { token } = theme.useToken();

        async function appearanceModeChangeHandler(input: boolean | 'system') {
            if (input === 'system' && appearanceModeSelected === 'system') {
                return;
            }

            const appearanceModeToBeUpdated = input === 'system' ? AppearanceModes.system : (input === true ? AppearanceModes.dark : AppearanceModes.light);

            const settingsToUpdate = {
                ...settings,
                appearance: {
                    ...settings.appearance,
                    mode: appearanceModeToBeUpdated
                }
            };

            await settingsUpdateOperations(settingsToUpdate);
        }

        async function handleAccentColorChange(accentColor: AccentColors) {
            const settingsToUpdate = {
                ...settings,
                appearance: {
                    ...settings.appearance,
                    accent_color: accentColor
                }
            };

            await settingsUpdateOperations(settingsToUpdate);
        }

        return (
            <React.Fragment>
                <div className='setting-container'>
                    <div className='setting-title'>
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
                    <div className='setting-title'>
                        Choose the accent color
                    </div>
                    <div className='appearance-choices'>
                        <Tooltip title='Ligth / Dark mode'>
                            <AccentColorPicker
                                onColorChange={handleAccentColorChange}
                                selectedAccentColor={selectedPrimaryColor}
                            />
                        </Tooltip>
                    </div>
                </div>
            </React.Fragment>
        )
    };

    const Preferences = () => {
        async function packageManagerChangeHandler(input: PackageManagers) {
            const settingsToUpdate = {
                ...settings,
                preferences: {
                    ...settings.preferences,
                    package_manager: input
                }
            };

            await settingsUpdateOperations(settingsToUpdate);
        }

        async function logLevelChangeHandler(input: LogLevels) {
            const settingsToUpdate = {
                ...settings,
                preferences: {
                    ...settings.preferences,
                    log_level: input
                }
            };

            await settingsUpdateOperations(settingsToUpdate);
        }

        return (
            <React.Fragment>
                <div className='setting-container'>
                    <div className='setting-title'>
                        Choose the preferred package manager
                    </div>
                    <div className='appearance-choices'>
                        <Tooltip title='Applies for all the future projects'>
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
                    <div className='setting-title'>
                        Choose the logging level
                    </div>
                    <div className='appearance-choices'>
                        <Tooltip title='Restart once log level is changed to help in debugging'>
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

    const settingsSections = () => ([
        {
            key: 'appearance',
            label: 'Appearance',
            children: <Appearance />
        },
        {
            key: 'project_preferences',
            label: 'Project Preferences',
            children: <Preferences />
        }
    ]);

    const onCollapseCheckChange = (isChecked: boolean) => {
        setCollapseAllSettings(isChecked);
    };

    return (
        <div className='settings-container'>
            <div className='title-container'>
                Settings
            </div>
            <Checkbox style={{ marginTop: '15px' }} checked={collapseAllSettings} onChange={(checkedValues) => onCollapseCheckChange(checkedValues.target.checked)}>
                Collapse all
            </Checkbox>
            <div className='settings-box'>
                <Collapse activeKey={collapseAllSettings ? [] : ['appearance', 'project_preferences']}
                    items={settingsSections()} />
            </div>
        </div>
    )
};

export default Settings;
