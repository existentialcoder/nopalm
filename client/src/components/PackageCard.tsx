import { Card, Switch, Avatar, Button, Tooltip, Popconfirm } from 'antd';

import { UploadOutlined, DeleteFilled } from '@ant-design/icons';

import './PackageCard.scss';

import React, { MouseEventHandler, useEffect, useState } from "react";

import { compare } from 'compare-versions';

import { PackageCardProps } from '../helpers/types';

import Dataservice from '../api/Dataservice';

import { notification } from 'antd';

const { Meta } = Card;

const PackageCard: React.FC<PackageCardProps> = (props: PackageCardProps) => {
    type NotificationType = 'success' | 'info' | 'warning' | 'error';

    const [api, contextHolder] = notification.useNotification();

    function notify(message: string, description: string, type: NotificationType) {
        return api[type]({
            message,
            description
        });
    }

    function uninstallPackage(packageName: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await Dataservice.uninstallPackage(packageName);
    
                props.reRenderPackages();
    
                notify('Uninstalled Package', `Successfully uninstalled package ${packageName}`, 'success');
                
                resolve('success');
            } catch (ex) {
                const msg = `Error uninstalling package ${packageName}`;
    
                console.error(msg, ex);
            
                notify('Uninstalled Package', msg, 'error');

                reject('failure')
            }
        });
    }
    
    function upgradePackage(packageName: string, version: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await Dataservice.upgradePackage(packageName, version);

                props.reRenderPackages();
    
                resolve(
                    notify('Uninstalled Package', `Successfully upgraded package ${packageName} to the latest version`, 'success')
                );
            } catch (ex) {
                const msg = `Error upgrading package ${packageName}`;
    
                console.error(msg, ex);
            
                reject(
                    notify('Uninstalled Package', msg, 'error')
                )
            }
        });
    }

    return (
        <Card bordered={false} style={{
            marginTop: '16px',
            height: '100px'
        }} loading={props.loading}>
            {contextHolder}
            <div className="card-main-container">
                <Meta
                    avatar={<Avatar src={props.package.logo} />}
                    title={props.package.name + ` (${props.package.installed_version})`}
                    description={props.package.description}
                />
                <div className="card-actions-container">
                    <div className="dev-dependency">
                        <Tooltip title='Toggle to make it a development dependency'>
                            <Switch checkedChildren="Dev" unCheckedChildren="Dev" checked={props.package.is_dev} ></Switch>
                        </Tooltip>
                    </div>
                    <div className="action-buttons">
                        {
                            compare(props.package.installed_version, props.package.latest_version, '=') ? ""
                                : <Popconfirm title="Upgrade the package"
                                    description="Are you sure to upgrade the package to latest version ?"
                                    onConfirm={() => upgradePackage(props.package.name, props.package.latest_version)}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button type="text" style={{ marginTop: '15px' }} size="middle" icon={<UploadOutlined />}>
                                    </Button>
                                </Popconfirm>
                        }
                        <Popconfirm title="Delete the package"
                            description="Are you sure to uninstall the package ?"
                            onConfirm={() => uninstallPackage(props.package.name)}
                            okText="Yes"
                            cancelText="No">
                            <Button type="text" danger={true} style={{ marginTop: '15px' }} size="middle" icon={<DeleteFilled />}>
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
        </Card>
    )
};

export default PackageCard;
