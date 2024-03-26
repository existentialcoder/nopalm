import React from 'react';

import * as antDColor from '@ant-design/colors'

import { theme, Tooltip } from 'antd';

import './AccentColorPicker.scss';

import { AccentColors, AccentColorPickerProps } from '../helpers/types';

const AccentColorPicker: React.FC<AccentColorPickerProps> = (props: AccentColorPickerProps) => {
    const { token } = theme.useToken();

    return (
        <div className='accent-color-picker-container'>
            {
                Object.keys(AccentColors).map(accentColor => (
                    // capitalized color name
                    <Tooltip key={accentColor} title={`${accentColor[0].toUpperCase()}${accentColor.slice(1)}`}>
                        <div onClick={() => props.onColorChange(accentColor)}
                        style={{
                            background: antDColor[accentColor].primary,
                            boxShadow: props.selectedAccentColor === accentColor ? `0 0 2px ${antDColor[accentColor].primary}` : '',
                            border: props.selectedAccentColor === accentColor ? `3px solid ${token.colorBgContainer}` : ''
                        }}
                        className='accent-color' />
                    </Tooltip>
                ))
            }
        </div>
    )
};

export default AccentColorPicker;
