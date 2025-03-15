import jwt from "jsonwebtoken";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
	id: string;
	usuario: string;
	cargo: string;
	exp: number;
}

// Valida se a Secret key foi definida no .env
if (!process.env.ACCESS_TOKEN_SECRET) {
	console.error("Erro: ACCESS_TOKEN_SECRET não definido no ambiente.");
	process.exit(1);
}

// Secret Key para assinar e verificar tokens
const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;

export default {
	/**
	 * Assina e gera um token JWT contendo as informações do usuário.
	 * @param payload - Dados do usuário a serem incluídos no token
	 * @param options - Opções adicionais para a geração do token (ex.: expiresIn)
	 * @returns Uma Promise que resolve para o token JWT assinado
	 */
	assinarAcessoToken(
		payload: { usuario: string; cargo: string },
		options?: jwt.SignOptions,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign(
				payload,
				accessTokenSecret,
				options || {},
				(err: Error | null, token?: string) => {
					if (err) {
						return reject(
							createError.InternalServerError("Erro ao gerar token"),
						);
					}
					resolve(token as string);
				},
			);
		});
	},

	/**
	 * Verifica e decodifica um token JWT.
	 * @param token - O token JWT a ser verificado
	 * @returns Uma Promise que resolve para o payload do token se válido
	 */
	verificarAcessoToken(token: string): Promise<TokenPayload> {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				accessTokenSecret,
				(err: Error | null, payload?: jwt.JwtPayload | string) => {
					if (err) {
						const message =
							err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
						return reject(createError.Unauthorized(message));
					}
					resolve(payload as TokenPayload);
				},
			);
		});
	},
};
