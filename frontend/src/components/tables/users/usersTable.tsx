"use client";
import React, { useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Usuario {
	id: number;
	nome: string;
	email: string;
	senha?: string;
	telefone?: string;
	cargo: "CLIENTE" | "EMPREGADO" | "ADMIN";
	criado_em?: string;
	atualizado_em?: string;
}
export const columns: ColumnDef<Usuario>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Selecionar todos"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Selecionar linha"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "nome",
		header: "Nome",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "telefone",
		header: "Telefone",
	},
	{
		accessorKey: "cargo",
		header: "Cargo",
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const usuario = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(usuario.id.toString())
							}
						>
							Copiar ID do usuário
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Ver detalhes</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export function DataTable() {
	const HOST = process.env.NEXT_PUBLIC_HOST;
	const PORT = process.env.NEXT_PUBLIC_PORT;

	const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const [data, setData] = React.useState<Usuario[]>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const [novoUsuario, setNovoUsuario] = React.useState({
		nome: "",
		email: "",
		telefone: "",
		senha: "",
		cargo: "CLIENTE",
	});

	const fetchUsuarios = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				console.error("Token de autenticação não encontrado");
				return;
			}

			const response = await fetch(
				`http://${HOST}:${PORT}/usuarios/consultar`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				const data = await response.json();
				console.log("Dados carregados:", data);
				setData([...data.usuarios]);
				console.log("data", data.usuarios);
			} else {
				const errorData = await response.json();
				console.error("Falha ao obter os usuários:", errorData);
				setErrorMessage(
					"Falha ao obter os usuários: " +
						(errorData.message || "Erro desconhecido"),
				);
				setIsErrorDialogOpen(true);
			}
		} catch (error) {
			setErrorMessage("Falha ao obter os usuários");
			setIsErrorDialogOpen(true);
			console.error("Falha ao obter os usuários:", error);
		}
	};

	const handleCadastrarUsuario = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				console.error("Token de autenticação não encontrado");
				return;
			}

			const response = await fetch(
				`http://${HOST}:${PORT}/usuarios/cadastrar`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(novoUsuario),
				},
			);
			console.log("Response", response);
			if (response.ok) {
				console.log("Usuário cadastrado com sucesso!");
				setIsModalOpen(false);
				fetchUsuarios();
			} else {
				setIsErrorDialogOpen(true);
				console.error("Falha ao cadastrar o usuário");
			}
		} catch (error) {
			console.error("Erro ao cadastrar o usuário:", error);
		}
	};

	React.useEffect(() => {
		fetchUsuarios();
	}, [HOST, PORT]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	console.log("Linhas da tabela:", table.getRowModel().rows);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filtrar emails..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("email")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex gap-2">
					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger asChild>
							<Button variant="default">Cadastrar Usuário</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Cadastrar Novo Usuário</DialogTitle>
								<DialogDescription>
									Preencha os campos abaixo para cadastrar um novo usuário.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Nome</Label>
									<Input
										value={novoUsuario.nome}
										onChange={(e) =>
											setNovoUsuario({ ...novoUsuario, nome: e.target.value })
										}
									/>
								</div>
								<div>
									<Label>Email</Label>
									<Input
										value={novoUsuario.email}
										onChange={(e) =>
											setNovoUsuario({ ...novoUsuario, email: e.target.value })
										}
									/>
								</div>
								<div>
									<Label>Telefone</Label>
									<Input
										value={novoUsuario.telefone}
										onChange={(e) =>
											setNovoUsuario({
												...novoUsuario,
												telefone: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<Label>Senha</Label>
									<Input
										value={novoUsuario.senha}
										onChange={(e) =>
											setNovoUsuario({ ...novoUsuario, senha: e.target.value })
										}
									/>
								</div>
								<div>
									<Label>Cargo</Label>
									<select
										value={novoUsuario.cargo}
										onChange={(e) =>
											setNovoUsuario({ ...novoUsuario, cargo: e.target.value })
										}
										className="w-full p-2 border rounded"
									>
										<option value="CLIENTE">Cliente</option>
										<option value="EMPREGADO">Empregado</option>
										<option value="ADMIN">Admin</option>
									</select>
								</div>
								<Button onClick={handleCadastrarUsuario}>Cadastrar</Button>
							</div>
						</DialogContent>
					</Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Campos <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Sem resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} de{" "}
					{table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Próximo
					</Button>
				</div>
			</div>
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
