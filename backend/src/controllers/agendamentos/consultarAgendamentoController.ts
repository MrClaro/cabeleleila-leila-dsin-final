import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import ConsultarAgendamentoService from "../../services/agendamentos/consultarAgendamentoService";
import Joi from "joi";

class ConsultarAgendamentoControllerr {
	async validarConsulta(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			try {
				const appointments =
					await ConsultarAgendamentoService.consultarAgendamentos();
				res.status(200).json({ appointments });
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
	async validarConsultaPorId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;
			const consultaSchema = Joi.object({
				id: Joi.number().integer().positive().required().messages({
					"number.min": "O id deve ser maior que 0",
					"number.required": "O id do agendamento é obrigatorio",
				}),
			});
			const { error } = consultaSchema.validate({
				id,
			});
			if (error) {
				return next(error);
			}
			const parsedId = parseInt(id);
			const appointment =
				await ConsultarAgendamentoService.consultarAgendamentoPorId(parsedId);
			if (!appointment) {
				return next(createError(404, "Agendamento não encontrado"));
			}
			res.status(200).json({ appointment });
		} catch (error) {
			if (error instanceof Joi.ValidationError) {
				return next(createError(400, error.details[0].message));
			}
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new ConsultarAgendamentoControllerr();
