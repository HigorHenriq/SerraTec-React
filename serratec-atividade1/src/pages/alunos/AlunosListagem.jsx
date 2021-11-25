import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "./styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const AlunosListagem = () => {
	const navigate = useNavigate();
	const MySwal = withReactContent(Swal);

	const [alunos, setAlunos] = useState([]);

	useEffect(() => {
		getAlunos();
	}, []);

	const getAlunos = () => {
		axios.get(API_URL).then((response) => {
			setTimeout(() => {
				setAlunos(response.data);
			}, 5000);
		});
	};

	const deletarAluno = (aluno) => {
		axios
			.delete(API_URL, { data: aluno })
			.then((response) => {
				MySwal.fire(<p>{response?.data?.message}</p>);

				const alunoIndex = alunos.findIndex(
					(elemento) => elemento.id === aluno.id
				);
				let newAlunos = [...alunos];
				newAlunos.splice(alunoIndex, 1);
				setAlunos(newAlunos);
			})
			.catch((error) => {
				MySwal.fire({
					icon: "error",
					title: "Oops...",
					text: error,
				});
			});
	};

	const editarAluno = (aluno) => {
		navigate(`/editar-alunos/${aluno.id}`);
	};

	return alunos.length > 0 ? (
		<Box sx={{ marginTop: "25px" }}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Nome</StyledTableCell>
							<StyledTableCell>Idade</StyledTableCell>
							<StyledTableCell>Cidade</StyledTableCell>
							<StyledTableCell>Ações</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{alunos.map((aluno) => (
							<StyledTableRow>
								<StyledTableCell>{aluno.nome}</StyledTableCell>
								<StyledTableCell>{aluno.idade}</StyledTableCell>
								<StyledTableCell>
									{aluno.cidade}
								</StyledTableCell>
								<StyledTableCell>
									<Button
										onClick={() => editarAluno(aluno)}
										variant="text"
									>
										<ModeEditIcon />
									</Button>
									<Button
										onClick={() => deletarAluno(aluno)}
										variant="text"
									>
										<DeleteIcon />
									</Button>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	) : (
		<>
			<Stack
				sx={{ color: "blue", margin: "150px 25vw" }}
				spacing={2}
				direction="row"
			>
				<CircularProgress color="inherit" />
			</Stack>
		</>
	);
};

export default AlunosListagem;
