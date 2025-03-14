import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import formataData from "../../tools/formataData";
import ConsultarAgendamentoService from "../../services/agendamentos/consultarAgendamentoService";
import AtualizarAgendamentoService from "../../services/agendamentos/atualizarAgendamentoService";

class AtualizarAgendamentoController {
	async validarAgendamento(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { date_time, services, status } = req.body;
			const appointmentId = parseInt(req.params.id);

			const appointmentExists =
				await ConsultarAgendamentoService.consultarAgendamentoPorId(
					appointmentId,
				);

			if (!appointmentExists) {
				return next(createError(404, "Agendamento não existente"));
			}

			const atualizaSchema = Joi.object({
				date_time: Joi.date().min("01-01-2025").optional().messages({
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
					.optional(),
			});

			const { error } = atualizaSchema.validate({
				date_time,
				services,
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
			try {
				if (formatedDate) {
					const dateObject = new Date(formatedDate);
					const appointment =
						await AtualizarAgendamentoService.atualizarAgendamento(
							appointmentId,
							dateObject,
							status,
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

export default new AtualizarAgendamentoController();
