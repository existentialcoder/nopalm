import React, { useState, useEffect } from 'react';

import Question from '../components/Question';

import { newProjectQuestions } from '../helpers/constants';

import { notification, Steps } from 'antd';

import { NewProjectDetailsProps, NewProjectTourProps, ProjectDetailsProps, QuestionObject } from '../helpers/types';

import ProjectDetailsForm from './ProjectDetailsForm';

import ProjectNotFoundOrInvalid from './ProjectNotFoundOrInvalid';

import Dataservice from '../api/Dataservice';

import store from '../store.tsx';

const NewProjectBasicDetails = (props: {
    questionsToBeRendered: string[],
    modifyProjectDetails: (value: string, _options: any, questionName: string) => void,
    newProjectDetails: NewProjectDetailsProps
}) => {
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
                props.questionsToBeRendered.map(questionToBeRendered => {
                    return (
                        getQuestionObject(questionToBeRendered) ? <Question key={questionToBeRendered}
                            answer={props.newProjectDetails[questionToBeRendered]}
                            questionObj={getQuestionObject(questionToBeRendered)}
                            answerHandler={props.modifyProjectDetails} /> : ''
                    )
                })
            }
        </div>
    )
};

const newProjectSteps = [
    {
        title: 'Scaffold',
        description: 'Quickly scaffold a project from templates',
        view: NewProjectBasicDetails
    },
    {
        title: 'Additional details',
        description: 'More info about project',
        view: ProjectDetailsForm
    }
];

const NewProjectSteps = (props: { defaults: ProjectDetailsProps, newProjectTourStepChangeHandler: (pageNumber: number) => void }) => {
    const [current, setCurrent] = useState(0);
    const [pageStatus, setPageStatus] = useState<'process' | 'wait' | 'finish' | 'error'>('process');
    const [questionsToBeRendered, setQuestionsToBeRendered] = useState<string[]>(['type_of_app']);

    const { newProjectDetails, setNewProjectDetails } = store();

    setNewProjectDetails({
        ...props.defaults
    });

    const modifyProjectDetails = (value: string, _options: any, questionName: string) => {
        const questionIndex = questionsToBeRendered.findIndex(qName => qName === questionName);

        if (questionIndex === 0 || (questionIndex === 1 && newProjectDetails['type_of_app'] === 'web_app')) {
            setQuestionsToBeRendered(
                questionsToBeRendered.slice(0, questionIndex + 1)
            );
        }

        return setNewProjectDetails({
            ...newProjectDetails,
            [questionName]: value
        });
    };

    const getQuestionsToAdd = (currentQuestionName: string, selectedOptionValue: string) => {
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

    const onPageChangeHandler = async (changedPageIdx) => {
        setCurrent(changedPageIdx);
        props.newProjectTourStepChangeHandler(changedPageIdx);
    }

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

    const StepToRender = newProjectSteps[current].view;

    return (
        <div className="new-project-container">
            {/* <h2 className="new-project-title"> New Project </h2> */}
            <Steps
                status={pageStatus}
                current={current}
                onChange={onPageChangeHandler}
                items={newProjectSteps}
            />
            <StepToRender
                newProjectDetails={newProjectDetails}
                questionsToBeRendered={questionsToBeRendered}
                modifyProjectDetails={modifyProjectDetails}
                projectDetails={props.defaults}
            />
        </div>
    )
};

const NewProjectTour: React.FC = () => {
    const [isConsentedForNewProject, setConsentedForNewProject] = useState(props.consentedForNewProject);

    const { newProjectDetails, setNewProjectDetails } = store();
    
    type NotificationType = 'success' | 'info' | 'warning' | 'error';

    const [api, contextHolder] = notification.useNotification();

    function notify(message: string, description: string, type: NotificationType) {
        return api[type]({
            message,
            description
        });
    }

    useEffect(() => {
        async function saveNewProject(newNodeProjectForm) {
            const isSaveSuccessful = await Dataservice.createNewProject(newNodeProjectForm);

            props.setIsSaveLoading(false);

            return notify(
                isSaveSuccessful ? 'Created new project' : 'Error creating new project',
                isSaveSuccessful ? 'Succesfully created new node project. Check your current working directory' : 'Error creating new project. Please check the debug logs',
                isSaveSuccessful ? 'success' : 'error'
            );
        }
    
        if (props.saveClicked) {
            props.setIsSaveLoading(true);

            saveNewProject(newProjectDetails);
        }
    }, [props.saveClicked])

    return (
        <React.Fragment>
            {contextHolder}
            {
                isConsentedForNewProject ? <NewProjectSteps
                    newProjectTourStepChangeHandler={props.newProjectTourStepChangeHandler}
                    defaults={props.defaults} /> :
                    <ProjectNotFoundOrInvalid type={props.isEmptyDir ? 'not_found' : 'invalid'} createNewProjectHandler={() => setConsentedForNewProject(true)} />
            }
        </React.Fragment>
    )
};

export default NewProjectTour;
