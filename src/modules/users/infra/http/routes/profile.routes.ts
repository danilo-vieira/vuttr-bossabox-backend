import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
    },
  }),
  profileController.delete,
);

export default profileRouter;
