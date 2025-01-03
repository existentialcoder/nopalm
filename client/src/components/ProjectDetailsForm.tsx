import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import './ProjectDetailsForm.scss'

import { FormFieldProps } from '../helpers/types';

import { Form, Collapse, Input, Select, Switch, Tooltip, Checkbox, GetProp, FormInstance } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

import { formFields } from '../helpers/constants';

import { AppDispatch, RootState } from '../store/store';

import { setNewProjectDetails, setProjectDetails } from '../store/slices/project';

const { TextArea } = Input;

const ProjectDetailsForm = (props: { setFormInstances: (formInstances: FormInstance[]) => void }) => {
    const dispatch = useDispatch<AppDispatch>();

    const isNewProject = useSelector((state: RootState) => state.project.isNewProject);

    const newProjectDetails = useSelector((state: RootState) => state.project.newProjectDetails);

    const projectDetails = useSelector((state: RootState) => state.project.projectDetails);

    const [collapseAll, setCollapseAll] = useState(false);

    function setFieldChangeInStorage(formField: FormFieldProps, val: any) {
        let valueToSet = ['switch'].includes(formField.type) ? val : val.target.value;

        if (formField.type === 'select') {
            const allSelectedItems = Array.from(val.currentTarget.querySelectorAll('.ant-select-selection-item')).map(item => item.textContent);

            valueToSet = formField.tags === true ? allSelectedItems : allSelectedItems[0]
                ;
        }

        const handler = isNewProject ? setNewProjectDetails : setProjectDetails;

        return dispatch(handler({
            ...newProjectDetails,
            [formField.name]: valueToSet
        }));
    }

    const renderFormField = (formField: FormFieldProps) => {
        switch (formField.type) {
            case 'input':
                return <Input onBlur={(val) => setFieldChangeInStorage(formField, val)} addonBefore={formField.addon_before || ''} maxLength={formField.max_length} placeholder={formField.placeholder} />;
            case 'textarea':
                return <TextArea onBlur={(val) => setFieldChangeInStorage(formField, val)} placeholder={formField.placeholder} rows={4} />;
            case 'select':
                return <Select placeholder={formField.placeholder}
                    onBlur={(val) => setFieldChangeInStorage(formField, val)}
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

    const FormWrapper = (props: { form: FormInstance, formKey: 'basic_meta_details' | 'ownership' | 'discoverability' }) => {
        const projectDetailsToWrap = isNewProject ? newProjectDetails : projectDetails;

        useEffect(() => {
            props.form.setFieldsValue(projectDetailsToWrap);
        }, [projectDetailsToWrap, props.form]);

        return (
            <Form form={props.form} layout='vertical' key={projectDetailsToWrap.name}
                initialValues={projectDetailsToWrap.name?.length ? projectDetailsToWrap : {}} autoComplete='on'
                style={{ maxWidth: '90%', margin: 'auto' }}>
                {
                    formFields[props.formKey].map(formField => {
                        return (
                            <Form.Item key={formField.name} name={formField.name}
                                rules={
                                    formField.required ? [{ required: true, message: `${formField.label} is required!` }] : []
                                }
                                label={
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
                                }>
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

    const [basicMetaDetailsForm] = Form.useForm(),
        [discoverabilityForm] = Form.useForm(),
        [ownershipForm] = Form.useForm();

    useEffect(() => {
        props.setFormInstances([basicMetaDetailsForm, discoverabilityForm, ownershipForm]);
    }, []);

    const projectDetailsFormSections = [
        {
            key: 'basic_meta_details',
            label: 'Basic meta details',
            children: <FormWrapper form={basicMetaDetailsForm} formKey='basic_meta_details' />
        },
        {
            key: 'discoverability',
            label: 'Project discoverability',
            children: <FormWrapper form={discoverabilityForm} formKey='discoverability' />
        },
        {
            key: 'ownership',
            label: 'Ownership',
            children: <FormWrapper form={ownershipForm} formKey='ownership' />
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
