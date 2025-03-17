import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import CadastrarUsuarioService from "../../services/usuarios/cadastrarUsuarioService";
import formataTelefone from "../../tools/formataTelefone";
import { usuario as Usuario } from "@prisma/client";

class CadastrarUsuarioController {
	async validarUsuario(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Usuario | null> {
		try {
			const { nome, email, senha, cargo, telefone } = req.body;
			console.log(
				"nome " + nome,
				"email " + email,
				"senha " + senha,
				"cargo " + cargo,
				"telefone " + telefone,
			);
			const cadastroSchema = Joi.object({
				nome: Joi.string()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z\\s]+$"))
					.trim()
					.required(),
				email: Joi.string()
					.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
					.required(),
				senha: Joi.string()
					.pattern(
						new RegExp(
							"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$",
						),
					)
					.required(),
				telefone: Joi.string()
					.min(9)
					.pattern(new RegExp("^[0-9]+$"))
					.required(),
				cargo: Joi.string().valid("EMPREGADO", "CLIENTE", "ADMIN").optional(),
			});

			const { error } = cadastroSchema.validate({
				nome,
				email,
				senha,
				telefone,
				cargo,
			});

			if (error) {
				next(error);
				return null;
			}

			const telefoneFormatado = formataTelefone(telefone);

			try {
				const usuario = await CadastrarUsuarioService.cadastrarUsuario(
					nome,
					email,
					senha,
					telefoneFormatado,
					cargo,
				);
				res.status(201).json({ usuario });
				return usuario;
			} catch (serviceError) {
				next(serviceError);
				return null;
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
			return null;
		}
	}
}

export default new CadastrarUsuarioController();
