const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 4000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/ping',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Hapi running at http://localhost:4000');
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
