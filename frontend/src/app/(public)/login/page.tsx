"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dotenv from "dotenv";
import Link from "next/link";
dotenv.config();

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [senha, setSenha] = useState<string>("");
	const router = useRouter();
	const HOST = process.env.NEXT_PUBLIC_HOST;
	const PORT = process.env.NEXT_PUBLIC_PORT;
	const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function login(ev: React.FormEvent<HTMLFormElement>) {
		ev.preventDefault();
		try {
			console.log(`http://${HOST}:${PORT}/login`);
			const response = await fetch(`http://${HOST}:${PORT}/login`, {
				method: "POST",
				body: JSON.stringify({ email, senha }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.token);
				router.push("/");
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.message || "Credenciais Erradas");
				setIsErrorDialogOpen(true);
			}
		} catch (error) {
			console.error("Login falhado:", error);
			setErrorMessage("Um erro ocorreu ao tentar fazer login");
			setIsErrorDialogOpen(true);
		}
	}
	return (
		<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
			<h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
				Login
			</h2>
			<p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
				Faça login para continuar
			</p>

			<form className="my-8" onSubmit={login}>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						placeholder="seuemail@dominio.com"
						type="email"
						value={email}
						onChange={(ev) => setEmail(ev.target.value)}
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Senha</Label>
					<Input
						id="password"
						placeholder="••••••••"
						type="password"
						value={senha}
						onChange={(ev) => setSenha(ev.target.value)}
					/>
				</LabelInputContainer>

				<button
					className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
				>
					Login &rarr;
					<BottomGradient />
				</button>

				<div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
				<Link
					href="/register"
					className="flex items-center justify-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 mb-2"
				>
					<span>Ainda não tem login? Registre-se</span>
				</Link>
				<Link
					href="/"
					className="flex items-center justify-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200"
				>
					<IconArrowLeft className="h-4 w-4" />
					<span>Voltar ao início</span>
				</Link>
			</form>

			<AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
				<AlertDialogContent className="bg-white rounded-md shadow-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-red-500 font-semibold">
							Erro
						</AlertDialogTitle>
						<AlertDialogDescription>{errorMessage}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Fechar</AlertDialogCancel>
						<AlertDialogAction onClick={() => setIsErrorDialogOpen(false)}>
							Tentar novamente
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};
