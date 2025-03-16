import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import formataData from "../../tools/formataData";
import CadastrarAgendamentoService from "../../services/agendamentos/cadastrarAgendamentoService";

class CadastrarAgendamentoController {
	async validarAgendamento(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { usuario_id, status, data_hora, servicos } = req.body;
			const cadastroSchema = Joi.object({
				data_hora: Joi.date().greater("now").required().messages({
					"date.min": "A data minima aceita é a data atual",
				}),
				servicos: Joi.array()
					.items(
						Joi.object({
							servicoId: Joi.number().required(),
							quantidade: Joi.number().optional(),
							observacoes: Joi.string().optional().messages({
								"number.required": "o id do serviço é obrigatorio",
							}),
						}),
					)
					.required(),
				usuario_id: Joi.number().integer().positive().required().messages({
					"number.required": "O id do usuário é obrigatorio",
				}),
			});

			const { error } = cadastroSchema.validate({
				data_hora,
				servicos,
				usuario_id,
			});

			if (error) {
				return next(error);
			}

			const temUsuarioId = usuario_id ? usuario_id : null;

			try {
				const dataFinal = new Date(data_hora);
				const agendamento =
					await CadastrarAgendamentoService.cadastrarAgendamento(
						temUsuarioId,
						status,
						dataFinal,
						servicos,
					);
				if (agendamento) {
					res.status(201).json({ response: agendamento });
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			return next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new CadastrarAgendamentoController();
