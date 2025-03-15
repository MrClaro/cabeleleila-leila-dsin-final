import express, { Request, Response, NextFunction, Router } from "express";
import CadastrarUsuarioController from "../../controllers/usuarios/cadastrarUsuarioController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { nome, email, senha } = req.body;

			if (!nome || !email || !senha) {
				res.status(400).json({
					response: "Formato da requisição inválida!",
				});
			}
			await CadastrarUsuarioController.validarUsuario(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
