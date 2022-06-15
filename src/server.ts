import express from 'express';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(routes)


app.listen(6969, () => {
  console.log('HTTP server running!!🚀');
});
