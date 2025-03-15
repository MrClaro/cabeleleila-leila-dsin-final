import jwt from "../utils/jwt";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

interface TokenPayload {
	id: string;
	usuario: string;
	cargo: string;
	exp: number;
}

interface AuthRequest extends Request {
	dados?: TokenPayload | { root: boolean };
}

const auth = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.headers.authorization) {
			throw createError.Unauthorized("Token de acesso é obrigatório");
		}

		const authHeader = req.headers.authorization;
		const parts = authHeader.split(" ");

		if (parts.length !== 2) {
			throw createError.Unauthorized("Token malformado");
		}

		const [scheme, token] = parts;

		if (!/^Bearer$/i.test(scheme)) {
			throw createError.Unauthorized("Token mal formatado");
		}

		if (token === process.env.ACCESS_TOKEN_SECRET) {
			req.dados = { root: true };
			return next();
		}

		try {
			const usuario = await jwt.verificarAcessoToken(token);

			if (
				typeof usuario === "object" &&
				"usuario" in usuario &&
				"exp" in usuario &&
				"cargo" in usuario
			) {
				req.dados = usuario as TokenPayload;
				return next();
			}

			throw createError.Unauthorized("Token inválido");
		} catch (error) {
			console.log("Erro do token: ", error);
			if (error instanceof TokenExpiredError) {
				next(createError.Unauthorized("Token expirado"));
			} else if (error instanceof JsonWebTokenError) {
				next(createError.Unauthorized("Token inválido"));
			} else {
				next(createError.Unauthorized("Não autorizado"));
			}
		}
	} catch (error) {
		next(error);
	}
};

export default auth;
