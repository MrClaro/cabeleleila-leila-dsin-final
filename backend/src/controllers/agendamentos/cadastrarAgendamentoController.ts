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
			const { client_id, user_id, status, date_time, services } = req.body;

			const cadastroSchema = Joi.object({
				client_id: Joi.number().positive().required().messages({
					"number.min": "O id deve ser maior que 0",
					"number.required": "O id do cliente é obrigatorio",
				}),
				date_time: Joi.date().min("01-01-2025").required().messages({
					"date.min": "A data minima aceita é 01/01/2025",
				}),
				services: Joi.array()
					.items(
						Joi.object({
							serviceId: Joi.number().required(),
							quantity: Joi.number().optional(),
							observations: Joi.string().optional(),
						}),
					)
					.required(),
				user_id: Joi.number().integer().positive().required().messages({
					"number.required": "O id do usuário é obrigatorio",
				}),
			});

			const { error } = cadastroSchema.validate({
				client_id,
				date_time,
				services,
				user_id,
			});

			if (error) {
				return next(error);
			}

			const formatedDate = formataData(date_time);
			if (!formatedDate) {
				return next(
					createError(400, "Data inválida ou fora do intervalo permitido."),
				);
			}
			const hasUserId = !user_id ? null : user_id;

			try {
				if (formatedDate) {
					const dateObject = new Date(formatedDate);
					const appointment =
						await CadastrarAgendamentoService.cadastrarAgendamento(
							client_id,
							hasUserId,
							status,
							dateObject,
							services,
						);
					if (appointment) {
						res.status(201).json({ response: appointment });
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
