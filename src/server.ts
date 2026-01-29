// import express, { Request, Response } from 'express';

// const app = express();
// app.use(express.json());

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import App from './app';
const app = new App()
app.start()

