import React, { useEffect, useState } from "react";

import Dataservice from '../api/Dataservice.ts';

import './ProjectDetails.scss';

import Question from '../components/Question';

import { newProjectQuestions } from '../helpers/constants';

import { Flex, Button, Form, Steps } from 'antd';

import { QuestionObject } from '../helpers/types';

const NewProjectBasicDetails = () => {
    const [questionsToBeRendered, setQuestionsToBeRendered] = useState<string[]>(['type_of_app']);

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

    const modifyProjectDetails = (value: string, _options: any, questionName: string) => {
        const questionIndex = questionsToBeRendered.findIndex(qName => qName === questionName);

        if (questionIndex === 0 || (questionIndex === 1 && newProjectDetails['type_of_app'] === 'web_app')) {
            setQuestionsToBeRendered(
                questionsToBeRendered.slice(0, questionIndex + 1)
            );
        }

        const result = {
            ...newProjectDetails,
            [questionName]: value
        }

        setNewProjectDetails(result);
    };

    return (
        <div className='new-project-basic-details-container'>
            {
                questionsToBeRendered.map(questionToBeRendered => {
                    return (
                        getQuestionObject(questionToBeRendered) ? <Question key={questionToBeRendered}
                            questionObj={getQuestionObject(questionToBeRendered)}
                            answerHandler={modifyProjectDetails} /> : ''
                    )
                })
            }
        </div>
    )
};

const NewProjectAdditionalDetails = () => {
    return (
        <div> hello add de</div>
    )
};

const NewProjectReview = () => {
    return (
        <div> hello review </div>
    )
};

const ProjectDetails: React.FC = () => {
    const [isNewProject, setIsNewProject] = useState(false);
    const [consentedForNewProject, setConsentedForNewProject] = useState(false);
    const [projectDetails, setProjectDetails] = useState({});

    const newProjectSteps = [
        {
            title: 'Basic details',
            description: 'What kind of project',
            view: NewProjectBasicDetails
        },
        {
            title: 'Additional meta data',
            description: 'Provide additional details for your node project',
            view: NewProjectAdditionalDetails
        },
        {
            title: 'Review',
            description: 'Review your project before proceeding',
            view: NewProjectReview
        }
    ];

    const NewProjectConsentForm = () => {
        return (
            <div className="new-project-consent">
                Node project is not found in the current directory!
                Click on create new project to start spinning one from scratch
                <div className="consent-btn-group">
                    <Flex gap="medium" wrap="wrap" justify="center" style={{ margin: "10px" }}>
                        <Button type={"primary"} onClick={() => setConsentedForNewProject(true)}>
                            Create new
                        </Button>
                    </Flex>
                </div>
            </div>
        )
    };

    const ProjectForm = () => {
        return (
            <div className="project-form-container">
                <Form>

                </Form>
            </div>
        );
    };

    const [current, setCurrent] = useState(0);
    const [pageStatus, setPageStatus] = useState('process');

    const onChange = (value: number) => {
        setCurrent(value);
    };

    const NewProjectForm = () => {
        const [newProjectDetails, setNewProjectDetails] = useState({});
        const StepToRender = newProjectSteps[current].view;
        return (
            <div className="new-project-container">
                {/* <h2 className="new-project-title"> New Project </h2> */}
                <Steps
                    status={pageStatus}
                    current={current}
                    onChange={onChange}
                    items={newProjectSteps}
                />
                <StepToRender newProjectDetails={newProjectDetails} />
            </div>
        )
    };

    useEffect(() => {
        async function setInitialFlags() {
            const projectDetails = await Dataservice.getProjectDetails();

            setIsNewProject(Object.keys(projectDetails).length > 0);
            setProjectDetails(projectDetails);
        }

        setInitialFlags();
    }, []);

    return (
        <div className="project-details-container">
            {isNewProject}
            {
                isNewProject && !consentedForNewProject ? <NewProjectConsentForm /> : ''
            }
            {/* new project steps | project form */}
            {
                isNewProject ? (
                    consentedForNewProject ? <NewProjectForm /> : ''
                ) : <ProjectForm />
            }
        </div>
    )
};

export default ProjectDetails;
