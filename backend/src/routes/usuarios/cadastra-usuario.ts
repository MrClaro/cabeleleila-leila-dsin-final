import { Request, Response, NextFunction, Router } from "express";
import CadastraUsuarioController from "../../controllers/cadastra-usuarui-controller";

const router = Router();

router.post(
	"/",
	async (res: Response, req: Request, next: NextFunction): Promise<any> => {
		try {
			const { name, email, password } = req.body;

			if (!name || !email || !password) {
				return res.status(400).json({
					response: "Formato da requisição inválida!",
				});
			}
			await CadastraUsuarioController.cadastraUsuario(res, req, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
