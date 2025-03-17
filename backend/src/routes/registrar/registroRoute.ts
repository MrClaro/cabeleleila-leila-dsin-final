import express, { Request, Response, NextFunction, Router } from "express";
import jwt from "../../utils/jwt";
import createError from "http-errors";
import { usuario as Usuario } from "@prisma/client";
import CadastrarUsuarioController from "../../controllers/usuarios/cadastrarUsuarioController";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { nome, email, telefone, senha } = req.body;
			console.log(nome, email, telefone, senha);
			if (!nome || !email || !telefone || !senha) {
				res.status(400).json({
					response: "Formato da requisição inválida!",
				});
				return;
			}

			const usuarioCadastrado: Usuario | null =
				await CadastrarUsuarioController.validarUsuario(req, res, next);
			if (!usuarioCadastrado) {
				console.log(usuarioCadastrado);
				res.status(400).json({
					response: "Usuário não cadastrado!",
				});
				return;
			}
			try {
				const tokenHttpOnly = await jwt.assinarAcessoToken(
					{
						usuario: usuarioCadastrado.email || "",
						cargo: usuarioCadastrado.cargo,
					},
					{ expiresIn: "1h" },
				);

				const tokenFrontend = await jwt.assinarAcessoToken(
					{
						usuario: usuarioCadastrado.email || "",
						cargo: usuarioCadastrado.cargo,
					},
					{ expiresIn: "1h" },
				);

				res.cookie("token", tokenHttpOnly, { httpOnly: true }).json({
					id: usuarioCadastrado.id,
					email: usuarioCadastrado.email,
					token: tokenFrontend,
				});
			} catch (error) {
				console.log(error);
				next(createError(500, "Erro ao gerar token"));
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
);

export default router;
