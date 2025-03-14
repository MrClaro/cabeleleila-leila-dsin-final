import express, { Router, Response, Request, NextFunction } from "express";
import ConsultarServicoController from "../../controllers/servicos/consultarServicoController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await ConsultarServicoController.validarConsulta(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);
router.get(
	"/:id",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;

			if (!id) {
				res.status(404).json({
					response: "Formato da requisição inválida!",
				});
			}
			await ConsultarServicoController.validarConsultaPorId(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
