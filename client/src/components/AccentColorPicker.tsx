import React from 'react';

import { theme, Tooltip } from 'antd';

import * as colors from '@ant-design/colors';

import { useSelector } from 'react-redux';

import './AccentColorPicker.scss';

import { AccentColors, AccentColorPickerProps } from '../helpers/types';

import { RootState } from '../store/store';

const AccentColorPicker: React.FC<AccentColorPickerProps> = (props: AccentColorPickerProps) => {
    const { token } = theme.useToken();

    const settings = useSelector((state: RootState) => state.app.globalSettings);

    return (
        <div className='accent-color-picker-container'>
            {
                Object.keys(AccentColors).map(accentColor => {
                    const accentColorCasted = accentColor as AccentColors;

                    return (
                        // capitalized color name
                        <Tooltip key={accentColorCasted} title={`${accentColorCasted[0].toUpperCase()}${accentColorCasted.slice(1)}`}>
                            <div onClick={() => props.onColorChange(accentColorCasted)}
                            style={{
                                background: colors[accentColorCasted].primary,
                                boxShadow: settings.appearance.accent_color === accentColorCasted ? `0 0 2px ${colors[accentColorCasted].primary}` : '',
                                border: settings.appearance.accent_color === accentColorCasted ? `3px solid ${token.colorBgContainer}` : ''
                            }}
                            className='accent-color' />
                        </Tooltip>
                    );
                })
            }
        </div>
    )
};

export default AccentColorPicker;
