import express, { Request, Response } from 'express';
const app = express();

app.get('/ping', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(4000, () => {
    console.log('Express running on http://localhost:4000');
});
