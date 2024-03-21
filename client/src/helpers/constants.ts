import { InstalledPackageProps, QuestionObject  } from "./types";

const linter =  {
    question_name: 'linter',
    question: 'Choose a code linter',
    options: [
        {
            value: 'eslint',
            label: 'ESLint'
        },
        {
            value: 'prettier',
            label: 'Prettier'
        },
        {
            value: 'jshint',
            label: 'JSHint'
        }
    ]
};

const typeScriptInclusion =  {
    question_name: 'ts_preference',
    question: 'Do you want to include Typescript?',
    logo_name: 'typescript',
    options: [
        {
            value: 'yes',
            label: 'Yes'
        },
        {
            value: 'no',
            label: 'No'
        }
    ]
};

const unitTestingFramework =  {
    question_name: 'unit_test_framework',
    logo_name: '',
    question: 'Choose a unit testing framework',
    options: [
        {
            value: 'jest',
            label: 'Jest'
        },
        {
            value: 'mocha',
            label: 'Mocha'
        },
    ]
};

const newProjectQuestions: QuestionObject = {
    question_name: 'type_of_app',
    logo_name: 'nodejs',
    question: 'What project do you want to build with Node JS?',
    options: [
        {
            value: 'cli',
            label: 'CLI Application',
            questions: [
                {
                    question_name: 'cli_utility_package',
                    question: 'Which CLI app utility package do you want to use app?',
                    logo_name: 'cli',
                    options: [
                        {
                            value: 'yargs',
                            label: 'Yargs'
                        },
                        {
                            value: 'commander',
                            label: 'Commander'
                        },
                        {
                            value: 'oclif',
                            label: 'Oclif'
                        },
                        {
                            value: 'caporal',
                            label: 'Caporal'
                        }
                    ]
                },
                typeScriptInclusion,
                linter,
                unitTestingFramework
            ]
        },
        {
            value: 'web_app',
            label: 'Web Application',
            questions: [
                {
                    question_name: 'type_of_web_app',
                    question: 'What kind of web application?',
                    logo_name: 'web',
                    options: [
                        {
                            value: 'frontend_only',
                            label: 'Frontend only',
                            questions: [
                                {
                                    question_name: 'frontend_framework',
                                    logo_name: 'web',
                                    question: 'Choose a frontend framework',
                                    options: [
                                        {
                                            value: 'vue',
                                            label: 'Vue JS'
                                        },
                                        {
                                            value: 'react',
                                            label: 'React'
                                        },
                                        {
                                            value: 'svelte',
                                            label: 'Svelte JS'
                                        }
                                    ]
                                },
                                {
                                    question_name: 'frontend_build_tool',
                                    question: 'Choose a build tool',
                                    logo_name: 'frontend_build_tool',
                                    options: [
                                        {
                                            value: 'vite',
                                            label: 'Vite'
                                        },
                                        {
                                            value: 'webpack',
                                            label: 'Webpack'
                                        },
                                        {
                                            value: 'rollup',
                                            label: 'Rollup'
                                        },
                                        {
                                            value: 'snowpack',
                                            label: 'Snowpack'
                                        }
                                    ]
                                },
                                typeScriptInclusion,
                                linter,
                                unitTestingFramework
                            ]
                        },
                        {
                            value: 'backend_only',
                            label: 'Backend only',
                            questions: [
                                {
                                    question_name: 'web_server_framework',
                                    question: 'Choose a node JS server framework',
                                    options: [
                                        {
                                            value: 'express',
                                            label: 'Express JS'
                                        },
                                        {
                                            value: 'fastify',
                                            label: 'Fastify'
                                        },
                                        {
                                            value: 'koa',
                                            label: 'Koa'
                                        },
                                        {
                                            value: 'hapi',
                                            label: 'Hapi'
                                        },
                                        {
                                            value: 'derby_js',
                                            label: 'Derby JS'
                                        }
                                    ]
                                },
                                {
                                    question_name: 'database',
                                    question: 'Choose a database',
                                    options: [
                                        {
                                            value: 'mysql',
                                            label: 'Mysql'
                                        },
                                        {
                                            value: 'postgresql',
                                            label: 'PostgreSQL'
                                        },
                                        {
                                            value: 'mongodb',
                                            label: 'MongoDB'
                                        }
                                    ]
                                },
                                {
                                    question_name: 'orm',
                                    question: 'Choose an ORM',
                                    options: [
                                        {
                                            value: 'sequelize',
                                            label: 'Sequelize'
                                        },
                                        {
                                            value: 'umzug',
                                            label: 'Umzug'
                                        },
                                        {
                                            value: 'mongoose',
                                            label: 'MongoDB'
                                        },
                                        {
                                            value: 'type_orm',
                                            label: 'MongoDB'
                                        },
                                        {
                                            value: 'prisma',
                                            label: 'Prisma'
                                        }
                                    ]
                                },
                                {
                                    question_name: 'Database',
                                    question: 'Choose a database',
                                    options: [
                                        {
                                            value: 'mysql',
                                            label: 'Mysql'
                                        },
                                        {
                                            value: 'postgresql',
                                            label: 'PostgreSQL'
                                        },
                                        {
                                            value: 'mongodb',
                                            label: 'MongoDB'
                                        }
                                    ]
                                },
                                typeScriptInclusion,
                                linter,
                                unitTestingFramework
                            ]
                        },
                        {
                            value: 'fullstack',
                            label: 'Full stack'
                        },
                    ]
                }
            ]
        }
    ],
};

const dummyPackage: InstalledPackageProps =  {
    name: 'dummy',
    installed_version: '1.0.0',
    latest_version: '1.0.0',
    description: 'dummt',
    homepage: 'dummy',
    logo: 'dummy',
    is_dev: false,
    versions: []
};

const dummyPackages = [0, 1, 2, 3, 4, 5].map(index => (
    {
        ...dummyPackage,
        name: `${dummyPackage}${index}`
    }
));

export {
    newProjectQuestions,
    dummyPackages
};
