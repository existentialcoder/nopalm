import React, { useEffect, useState } from 'react';

import './ProjectDetailsForm.scss'

import { FormFieldProps, ProjectDetailsFormProps, ProjectDetailsProps } from '../helpers/types';

import { Form, Collapse, Input, Select, Switch, Tooltip, Checkbox, GetProp } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

import { formFields } from '../helpers/constants';
import store from '../store';

const { TextArea } = Input;

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = (props: ProjectDetailsFormProps) => {
    const { newProjectDetails, setNewProjectDetails } = store();

    const [collapseAll, setCollapseAll] = useState(false);

    function setFieldChangeInStorage(formField: FormFieldProps, val: any) {
        const valueToSet = ['switch', 'select'].includes(formField.type) ? val : val.target.value;

        return setNewProjectDetails({
            ...newProjectDetails,
            [formField.name]: valueToSet
        });
    }

    const renderFormField = (formField: FormFieldProps) => {
        switch (formField.type) {
            case 'input':
                return <Input onChange={(val) => setFieldChangeInStorage(formField, val)} addonBefore={formField.addon_before || ''} maxLength={formField.max_length} placeholder={formField.placeholder} />;
            case 'textarea':
                return <TextArea onChange={(val) => setFieldChangeInStorage(formField, val)} placeholder={formField.placeholder} rows={4} />;
            case 'select':
                return <Select placeholder={formField.placeholder}
                    onChange={(val) => setFieldChangeInStorage(formField, val)}
                    mode={formField.tags ? 'tags' : (formField.multiple ? 'multiple' : undefined)}
                    options={formField.options}
                />;
            case 'switch':
                return <Switch onChange={(val) => setFieldChangeInStorage(formField, val)}
                    checkedChildren={formField.options && formField.options[1].label} unCheckedChildren={formField.options && formField.options[0].label} />;
            default:
                return '';
        }
    };

    const FormWrapper = (props: { projectDetails: ProjectDetailsProps, projectformKey: 'basic_meta_details' | 'ownership' | 'discoverability' }) => {
        const [form] = Form.useForm();

        return (
            <Form form={form} layout='vertical'
                initialValues={props.projectDetails}
                style={{ maxWidth: '90%', margin: 'auto' }}>
                {
                    formFields[props.formKey].map(formField => {
                        return (
                            <Form.Item key={formField.name} label={
                                <span>
                                    {formField.label}
                                    {
                                        formField.hint && <span style={{
                                            cursor: 'pointer',
                                            marginLeft: '5px'
                                        }}>
                                            <Tooltip title={formField.hint}>
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                </span>
                            } required={formField.required} name={formField.name}>
                                {

                                    renderFormField(formField)
                                }
                            </Form.Item>
                        )
                    })
                }
            </Form >
        )
    };

    const projectDetailsFormSections = [
        {
            key: 'basic_meta_details',
            label: 'Basic meta details',
            children: <FormWrapper projectDetails={props.projectDetails} formKey='basic_meta_details' />
        },
        {
            key: 'discoverability',
            label: 'Project discoverability',
            children: <FormWrapper projectDetails={props.projectDetails} formKey='discoverability' />
        },
        {
            key: 'ownership',
            label: 'Ownership',
            children: <FormWrapper projectDetails={props.projectDetails} formKey='ownership' />
        }
    ];

    const onCollapseCheckChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        setCollapseAll(checkedValues.target.checked);
    };

    return (
        <React.Fragment>
            <Checkbox style={{ marginTop: '15px' }} checked={collapseAll} onChange={onCollapseCheckChange}>
                Collapse all
            </Checkbox>
            <Collapse className='project-details-form-container'
                activeKey={collapseAll ? [] : ['basic_meta_details', 'discoverability', 'ownership']}
                items={projectDetailsFormSections} />
        </React.Fragment>
    )
};

export default ProjectDetailsForm;
