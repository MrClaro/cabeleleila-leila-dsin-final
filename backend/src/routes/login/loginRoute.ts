import express, { Request, Response, NextFunction, Router } from "express";
import ConsultarUsuarioController from "../../controllers/usuarios/consultarUsuarioController";
import bcrypt from "bcryptjs";
import jwt from "../../utils/jwt";
import createError from "http-errors";
import { usuario as Usuario } from "@prisma/client";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { email, senha } = req.body;

			if (!email || !senha) {
				res.status(400).json({
					response: "Formato da requisição inválida!",
				});
				return;
			}

			const usuario: Usuario | null =
				await ConsultarUsuarioController.validarConsultaPorEmail(
					req,
					res,
					next,
				);

			console.log("usuario encontrado: ", usuario);
			if (!usuario) {
				res.status(400).json({
					response: "Usuário inválido!",
				});
				return;
			}

			const passOk = bcrypt.compareSync(senha, usuario.senha);

			if (!passOk) {
				res.status(400).json({ response: "Senha inválida!" });
				return;
			}

			try {
				const token = await jwt.assinarAcessoToken(
					{ usuario: usuario.email, cargo: usuario.cargo },
					{ expiresIn: "1h" },
				);

				res.cookie("token", token, { httpOnly: true }).json({
					id: usuario.id,
					email: usuario.email,
				});
			} catch (err) {
				next(createError(500, "Erro ao gerar token"));
			}
		} catch (error) {
			next(error);
		}
	},
);

export default router;
