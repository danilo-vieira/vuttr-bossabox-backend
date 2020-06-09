import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteUserAccountService from '../../../services/DeleteUserAccountService';

export default class ProfileController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { password } = request.body;

    const deleteUserAccount = container.resolve(DeleteUserAccountService);

    await deleteUserAccount.execute({
      user_id,
      password,
    });

    return response.status(204).send();
  }
}
