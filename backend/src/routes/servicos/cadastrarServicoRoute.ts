import express, { Router, Response, Request, NextFunction } from "express";
import CadastraServicoController from "../../controllers/servicos/cadastrarServicoController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		try {
			const { name, price } = req.body;

			if (!name || !price) {
				return res.status(404).json({
					response: "Formato da requisição inválida!",
				});
			}
			await CadastraServicoController.validarServico(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
