import React from "react";

import { Select, Switch, Tooltip } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

import { QuestionProps } from '../helpers/types';

import './Question.scss';

import BrandLogo from '../logos/BrandLogo';

const Question: React.FC<QuestionProps> = ({ questionObj, answer, answerHandler }) => {
    const renderInputElBasedOnType = () => {
        switch (questionObj?.type) {
            case 'select':
                return <Select
                    style={{ width: 150 }}
                    value={answer}
                    options={questionObj.options}
                    onSelect={(...args) => answerHandler(...args, questionObj.question_name)}
                />
            case 'switch':
                return <Switch
                    checkedChildren={questionObj.options[1].label} unCheckedChildren={questionObj.options[0].label}
                    onChange={(checked) => answerHandler(questionObj.options[checked ? 1 : 0].value, undefined, questionObj.question_name)}
                    checked={answer === questionObj.options[1].value} />
            default:
                return '';
        }
    };

    return (
        questionObj && <div className='question-container'>
            <div className='question'>
                {/* <BrandLogo name={questionObj.logo_name} /> */}
                {questionObj.question}
                {
                    questionObj.tooltip_message && <div className='info-icon'>
                        <Tooltip className='info-icon' title={questionObj.tooltip_message}>
                            <InfoCircleOutlined />
                        </Tooltip>
                    </div>
                }
            </div>
            <div>
                {
                    renderInputElBasedOnType()
                }
            </div>
        </div>
    )
};

export default Question;
