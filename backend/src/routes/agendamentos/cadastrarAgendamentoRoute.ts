import express, { Router, Response, Request, NextFunction } from "express";
import CadastrarAgendamentoController from "../../controllers/agendamentos/cadastrarAgendamentoController";

const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { user_id, client_id, date_time, services } = req.body;
			if (!user_id || !client_id || !date_time || services.length == 0) {
				res.status(400).json({
					Response: "Formato da requisição inválida!",
				});
			}
			await CadastrarAgendamentoController.validarAgendamento(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

export default router;
