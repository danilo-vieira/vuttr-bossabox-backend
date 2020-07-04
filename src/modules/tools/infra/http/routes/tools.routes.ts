import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ToolsController from '../controllers/ToolsController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const toolsRouter = Router();
const toolsController = new ToolsController();

toolsRouter.use(ensureAuthenticated);

toolsRouter.get('/', toolsController.index);
toolsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      link: Joi.string().required(),
      description: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
    },
  }),
  toolsController.create,
);
toolsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      link: Joi.string().required(),
      description: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
    },
  }),
  toolsController.update,
);
toolsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
  }),
  toolsController.delete,
);

export default toolsRouter;
