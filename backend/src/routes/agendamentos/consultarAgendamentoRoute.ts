import express, { Router, Response, Request, NextFunction } from "express";
import ConsultarAgendamentoController from "../../controllers/agendamentos/consultarAgendamentoController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await ConsultarAgendamentoController.validarConsulta(req, res, next);
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
			await ConsultarAgendamentoController.validarConsultaPorId(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
