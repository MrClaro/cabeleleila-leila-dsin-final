import express, { Request, Response, NextFunction, Router } from "express";
import CadastraUsuarioController from "../../controllers/usuarios/cadastrarUsuarioController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		try {
			const { name, email, password } = req.body;

			if (!name || !email || !password) {
				return res.status(400).json({
					response: "Formato da requisição inválida!",
				});
			}
			await CadastraUsuarioController.validarUsuario(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
