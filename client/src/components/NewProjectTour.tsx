import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Question from '../components/Question';

import { newProjectQuestions } from '../helpers/constants';

import { FormInstance, Steps } from 'antd';

import { NewProjectQuestion, QuestionObject } from '../helpers/types';

import ProjectDetailsForm from './ProjectDetailsForm';

import ProjectNotFoundOrInvalid from './ProjectNotFoundOrInvalid';

import { AppDispatch, RootState } from '../store/store.ts';

import { setNewProjectDetails, setShouldShowSaveButton } from '../store/slices/project.ts';

const NewProjectTour: React.FC<{ setFormInstances: (formInstances: FormInstance[]) => void }>
    = (props: { setFormInstances: (formInstances: FormInstance[]) => void }) => {
        const dispatch = useDispatch<AppDispatch>();

        const newProjectDefaults = useSelector((state: RootState) => state.project.newProjectDefaults);

        const emptyProjectStateType = useSelector((state: RootState) => state.project.emptyProjectStateType);

        const newProjectDetails = useSelector((state: RootState) => state.project.newProjectDetails);

        const [isConsentedForNewProject, setConsentedForNewProject] = useState(false);

        const [currentStep, setCurrentStep] = useState(0);

        const [pageStatus] = useState<'process' | 'wait' | 'finish' | 'error'>('process');

        const [questionsToBeRendered, setQuestionsToBeRendered] = useState<NewProjectQuestion[]>(['type_of_app']);

        const modifyProjectDetails = (value: string, _options: any, questionName: string) => {
            const questionIndex = questionsToBeRendered.findIndex(qName => qName === questionName);

            if (questionIndex === 0 || (questionIndex === 1 && newProjectDetails['type_of_app'] === 'web_app')) {
                setQuestionsToBeRendered(
                    questionsToBeRendered.slice(0, questionIndex + 1)
                );
            }

            dispatch(setNewProjectDetails({
                ...newProjectDetails,
                [questionName]: value
            }));
        };

        const getQuestionsToAdd = (currentQuestionName: NewProjectQuestion, selectedOptionValue: string) => {
            const findQuestion = (question: QuestionObject): string[] | undefined => {
                if (question.question_name === currentQuestionName) {
                    const selectedOption = question.options.find((option) => option.value === selectedOptionValue);
                    if (selectedOption && selectedOption.questions && selectedOption.questions.length > 0) {
                        return selectedOption.questions.map(({ question_name }) => question_name);
                    }
                } else {
                    for (const option of question.options) {
                        if (option.questions) {
                            const subQuestion = option.questions.find((subQuestion) => subQuestion.question_name === currentQuestionName);
                            if (subQuestion) {
                                return findQuestion(subQuestion);
                            }
                        }
                    }
                }
                return undefined;
            };

            return findQuestion(newProjectQuestions);
        };

        const onPageChangeHandler = async (changedPageIdx: number) => {
            setCurrentStep(changedPageIdx);

            dispatch(setShouldShowSaveButton(changedPageIdx === 1));
        };

        const NewProjectBasicDetails = () => {
            const getQuestionObject = (question_name: string, questionObj: QuestionObject = newProjectQuestions): QuestionObject | undefined => {
                if (questionObj.question_name === question_name) {
                    return questionObj;
                }

                if (questionObj.options) {
                    for (const option of questionObj.options) {
                        if (option.questions) {
                            for (const nestedQuestion of option.questions) {
                                const result = getQuestionObject(question_name, nestedQuestion);
                                if (result) {
                                    return result;
                                }
                            }
                        }
                    }
                }

                return undefined;
            };

            return (
                <div className='new-project-basic-details-container'>
                    {
                        questionsToBeRendered.map(questionToBeRendered => {
                            return (
                                getQuestionObject(questionToBeRendered) ? <Question key={questionToBeRendered}
                                    answer={newProjectDetails[questionToBeRendered]}
                                    questionObj={getQuestionObject(questionToBeRendered)}
                                    answerHandler={modifyProjectDetails} /> : ''
                            )
                        })
                    }
                </div>
            )
        };

        const newProjectSteps = [
            {
                title: 'Scaffold',
                description: 'Quickly scaffold a project by answering quick questions'
            },
            {
                title: 'Additional details',
                description: 'More info about project'
            }
        ];

        useEffect(() => {
            const poppedQuestion = questionsToBeRendered[questionsToBeRendered.length - 1];

            if (newProjectDetails[poppedQuestion]) {
                const questionsToAdd = getQuestionsToAdd(poppedQuestion, newProjectDetails[poppedQuestion]);

                if (questionsToAdd !== undefined) {
                    setQuestionsToBeRendered(
                        [
                            ...questionsToBeRendered,
                            ...questionsToAdd
                        ]
                    );
                }
            }
        }, [newProjectDetails]);

        useEffect(() => {
            if (Object.keys(newProjectDetails).length === 0) {
                dispatch(setNewProjectDetails({ ...newProjectDefaults }));
            }
        }, []);

        return (
            <React.Fragment>
                {
                    isConsentedForNewProject ? <div className='new-project-container'>
                        {/* <h2 className="new-project-title"> New Project </h2> */}
                        <Steps
                            status={pageStatus}
                            current={currentStep}
                            onChange={onPageChangeHandler}
                            items={newProjectSteps}
                        />
                        {
                            currentStep === 0 && <NewProjectBasicDetails />
                        }
                        {
                            currentStep === 1 && <ProjectDetailsForm setFormInstances={props.setFormInstances} />
                        }
                    </div> :
                        <ProjectNotFoundOrInvalid type={emptyProjectStateType} createNewProjectHandler={() => setConsentedForNewProject(true)} />
                }
            </React.Fragment>
        );
    };

export default NewProjectTour;
