import express, { Response, Request, NextFunction, Router } from "express";
import AtualizarAgendamentoController from "../../controllers/agendamentos/atualizarAgendamentoController";

const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.patch(
	"/:id",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(404).json({
					response: "Formato da requisição inválida!",
				});
			}
			await AtualizarAgendamentoController.validarAgendamento(req, res, next);
		} catch (error) {
			next(error);
		}
	},
);

export default router;
