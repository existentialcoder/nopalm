import React from "react";

import { Select } from 'antd';

import { QuestionProps } from '../helpers/types';

import './Question.scss';

const Question: React.FC <QuestionProps> = ({ questionObj, answerHandler }) => {
    return (
        <div className='question-container'>
            <div className='question'>
            {/* <BrandLogo name={questionObj.logo_name} /> */}
                {questionObj.question}
            </div>
            <div>
            <Select
                style={{ width: 150 }}
                options={questionObj.options}
                onSelect={(...args) => answerHandler(...args, questionObj.question_name)}
            />
            </div>
        </div>
    )
};

export default Question;
