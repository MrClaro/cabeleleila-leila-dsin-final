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
			const { cliente_id, usuario_id, status, data_hora, servicos } = req.body;

			const cadastroSchema = Joi.object({
				cliente_id: Joi.number().positive().required().messages({
					"number.min": "O id deve ser maior que 0",
					"number.required": "O id do cliente é obrigatorio",
				}),
				data_hora: Joi.date().min("01-01-2025").required().messages({
					"date.min": "A data minima aceita é 01/01/2025",
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
				cliente_id,
				data_hora,
				servicos,
				usuario_id,
			});

			if (error) {
				return next(error);
			}

			const dataFormatada = formataData(data_hora);
			if (!dataFormatada) {
				return next(
					createError(400, "Data inválida ou fora do intervalo permitido."),
				);
			}
			const temUsuarioId = usuario_id ? usuario_id : null;

			try {
				if (dataFormatada) {
					const dataFinal = new Date(dataFormatada);
					const agendamento =
						await CadastrarAgendamentoService.cadastrarAgendamento(
							cliente_id,
							temUsuarioId,
							status,
							dataFinal,
							servicos,
						);
					if (agendamento) {
						res.status(201).json({ response: agendamento });
					}
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
