import express, { Router, Response, Request, NextFunction } from "express";
import CadastrarAgendamentoController from "../../controllers/agendamentos/cadastrarAgendamentoController";

const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { usuario_id, cliente_id, data_hora, servicos } = req.body;
			if (!usuario_id || !cliente_id || !data_hora || servicos.length == 0) {
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
