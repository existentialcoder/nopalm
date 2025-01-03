import { FormFieldProps, InstalledPackageProps, QuestionObject } from "./types";

const linter: QuestionObject = {
    question_name: 'linter',
    question: 'Choose a code linter',
    type: 'select',
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

const typeScriptInclusion: QuestionObject = {
    question_name: 'ts_preference',
    question: 'Do you want to include Typescript?',
    type: 'switch',
    logo_name: 'typescript',
    options: [
        {
            value: 'no',
            label: 'No'
        },
        {
            value: 'yes',
            label: 'Yes'
        }
    ]
};

const unitTestingFramework: QuestionObject = {
    question_name: 'unit_test_framework',
    logo_name: '',
    type: 'select',
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

const frontendQuestions: QuestionObject[] = [{
    question_name: 'frontend_framework',
    logo_name: 'web',
    type: 'select',
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
            value: 'preact',
            label: 'Preact'
        },
        {
            value: 'svelte',
            label: 'Svelte JS'
        }
    ]
},
// {
//     question_name: 'frontend_build_tool',
//     question: 'Choose a build tool',
//     type: 'select',
//     logo_name: 'frontend_build_tool',
//     options: [
//         {
//             value: 'vite',
//             label: 'Vite'
//         },
//         {
//             value: 'webpack',
//             label: 'Webpack'
//         },
//         {
//             value: 'rollup',
//             label: 'Rollup'
//         },
//         {
//             value: 'snowpack',
//             label: 'Snowpack'
//         }
//     ]
// }
];

const backendQuestions: QuestionObject[] = [{
    question_name: 'web_server_framework',
    question: 'Choose a web server framework',
    type: 'select',
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
            value: 'derby',
            label: 'Derby JS'
        }
    ]
},
/**
 * @todo: Add database integration in template
 */
// {
//     question_name: 'database',
//     question: 'Choose a database',
//     type: 'select',
//     options: [
//         {
//             value: 'mysql',
//             label: 'Mysql'
//         },
//         {
//             value: 'postgresql',
//             label: 'PostgreSQL'
//         },
//         {
//             value: 'mongodb',
//             label: 'MongoDB'
//         }
//     ]
// },
/**
 * @todo: Add ORM integration in template
 */
// {
//     question_name: 'orm',
//     question: 'Choose an ORM',
//     type: 'select',
//     options: [
//         {
//             value: 'sequelize',
//             label: 'Sequelize'
//         },
//         {
//             value: 'umzug',
//             label: 'Umzug'
//         },
//         {
//             value: 'mongoose',
//             label: 'Mongoose'
//         },
//         {
//             value: 'type_orm',
//             label: 'Type ORM'
//         },
//         {
//             value: 'prisma',
//             label: 'Prisma'
//         }
//     ]
// }
];

const newProjectQuestions: QuestionObject = {
    question_name: 'type_of_app',
    logo_name: 'nodejs',
    question: 'What specific project do you want to build with Node JS?',
    tooltip_message: 'Skip or select none to initialize an empty project',
    type: 'select',
    options: [
        {
            value: 'none',
            label: 'None',
            questions: []
        },
        {
            value: 'cli',
            label: 'CLI Application',
            questions: [
                {
                    question_name: 'cli_utility_package',
                    question: 'Which CLI app utility package do you want to use?',
                    type: 'select',
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
                        },
                        {
                            value: 'meow',
                            label: 'Meow'
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
                    type: 'select',
                    logo_name: 'web',
                    options: [
                        {
                            value: 'frontend_only',
                            label: 'Frontend only',
                            questions: [
                                ...frontendQuestions,
                                typeScriptInclusion,
                                linter,
                                unitTestingFramework
                            ]
                        },
                        {
                            value: 'backend_only',
                            label: 'Backend only',
                            questions: [
                                ...backendQuestions,
                                typeScriptInclusion,
                                linter,
                                unitTestingFramework
                            ]
                        },
                        {
                            value: 'fullstack',
                            label: 'Full stack',
                            questions: [
                                ...frontendQuestions,
                                ...backendQuestions,
                                typeScriptInclusion,
                                linter,
                                unitTestingFramework
                            ]
                        },
                    ]
                }
            ]
        }
    ],
};

const dummyPackage: InstalledPackageProps = {
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


const formFields: {
    basic_meta_details: FormFieldProps[],
    discoverability: FormFieldProps[],
    ownership: FormFieldProps[]
} = {
    basic_meta_details: [
        {
            name: 'name',
            label: 'Name',
            placeholder: 'my_awesome_node_package',
            type: 'input',
            max_length: 214,
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: true,
            placeholder: 'The awesome_node_package is meant to be just awesome'
        },
        {
            name: 'private',
            label: 'Private',
            type: 'switch',
            hint: 'A private package cannot be published to npm registry',
            options: [
                {
                    value: 'no',
                    label: 'No'
                },
                {
                    value: 'yes',
                    label: 'Yes'
                }   
            ]
        }
    ],
    discoverability: [
        {
            name: 'keywords',
            label: 'Keywords',
            hint: 'This helps people discover your package as it\'s listed in npm search',
            type: 'select',
            placeholder: 'awesomeness, npm, node',
            tags: true,
            options: []
        },
        {
            name: 'repository',
            label: 'Repository url',
            type: 'input',
            addon_before: 'https://',
            placeholder: 'github.com/john/my_awesome_node_package.git'
        },
        {
            name: 'homepage',
            label: 'Homepage',
            type: 'input',
            addon_before: 'https://',
            placeholder: 'github.com/john/my_awesome_node_package/#readme'
        },
        {
            name: 'bugs',
            label: 'Bugs',
            type: 'input',
            addon_before: 'https://',
            placeholder: 'github.com/john/my_awesome_node_package/issues'
        }
    ],
    ownership: [
        {
            name: 'license',
            label: 'License',
            type: 'input',
            placeholder: 'MIT'
        },
        {
            name: 'author',
            label: 'Author',
            type: 'input',
            placeholder: 'Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)'
        }
    ]
};

const nopalmGitHubPath = 'https://github.com/existentialcoder/nopalm';;

export {
    newProjectQuestions,
    dummyPackages,
    formFields,
    nopalmGitHubPath
};
