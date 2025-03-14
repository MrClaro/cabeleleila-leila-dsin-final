import express, { Router, Response, Request, NextFunction } from "express";
import CadastrarServicoController from "../../controllers/servicos/cadastrarServicoController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { name, price } = req.body;

			if (!name || !price) {
				res.status(404).json({
					response: "Formato da requisição inválida!",
				});
			}
			await CadastrarServicoController.validarCadastro(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
