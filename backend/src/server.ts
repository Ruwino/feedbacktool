import dotenv from 'dotenv';
import { AppBuilder } from './Creation/AppBuilder';
import { PublicRoutes } from './Routes/PublicRoutes';
import { StudentRoutes } from './Routes/StudentRoutes';
import { TeacherRoutes } from './Routes/TeacherRoutes';
import { UserRoutes } from './Routes/UserRoutes';

dotenv.config();

const port = parseInt(process.env.PORT || '');

if (!port) {
  throw new Error("PORT environment variable is not set");
}

const appBuilder = new AppBuilder(true);

appBuilder.setRoutes([
  new PublicRoutes(),
  new UserRoutes(),
  new StudentRoutes(),
  new TeacherRoutes()
]);

appBuilder.startServer(port);