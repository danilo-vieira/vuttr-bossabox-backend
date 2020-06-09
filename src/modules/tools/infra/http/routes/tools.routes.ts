import { Router } from 'express';
import ToolsController from '../controllers/ToolsController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const toolsRouter = Router();
const toolsController = new ToolsController();

toolsRouter.use(ensureAuthenticated);

toolsRouter.get('/', toolsController.index);
toolsRouter.post('/', toolsController.create);
toolsRouter.put('/:id', toolsController.update);
toolsRouter.delete('/:id', toolsController.delete);

export default toolsRouter;
