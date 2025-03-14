import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import formataData from "../../tools/formataData";
import CadastrarAtendimentoService from "../../services/atendimentos/cadastrarAtendimentoService";

class CadastrarAtendimentoController {
	async validarAtendimento(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { client_id, user_id, date_time, services } = req.body;

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
				user_id: Joi.number().required(),
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
						await CadastrarAtendimentoService.cadastrarAtendimento(
							client_id,
							hasUserId,
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

export default new CadastrarAtendimentoController();
