import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "./styles";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { API_MATERIAS } from "../../constants";
import LinearProgress from "@mui/material/LinearProgress";
import { MateriasContext } from "../../context/materias";
import { useNavigate } from "react-router-dom";

const MateriasListagem = () => {
	//INICIA O MYSWAL COM O WithReactContent Por questões da API
	const MySwal = withReactContent(Swal);
	const navigate = useNavigate();

	// const [materias, setMaterias] = useState([]);
	const { materias, setMaterias } = useContext(MateriasContext);

	useEffect(() => {

			getMaterias();

	}, []);

	// const getMaterias = () => {
	// 	axios.get(API_MATERIAS).then((response) => {
	// 		setTimeout(() => {
	// 			setMaterias(response.data);
	// 		}, 1000);
	// 	});
	// };

	const getMaterias = () => {
		axios.get(API_MATERIAS).then((response) => {
			setTimeout(() => {
				setMaterias(response.data);
			}, 1000);
		});
	};

	const deletarMateria = (materia) => {
		axios
			.delete(API_MATERIAS, { data: materia })
			.then((response) => {
				MySwal.fire({
					icon: "success",
					title: "Removido com sucesso!",
					text: response?.data?.message,
				});

				getMaterias();
			})
			.catch((error) => {
				MySwal.fire({
					icon: "error",
					title: "Oops...",
					text: error,
				});
			});
	};

	const editarMateria = (materia) => {
		navigate(`/editar-materias/${materia.id}`);
	};

	return materias.length > 0 ? (
		<Box sx={{ marginTop: "25px", marginBottom: "15px" }}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell align="center">
								Materia
							</StyledTableCell>
							<StyledTableCell align="center">
								Professor
							</StyledTableCell>
							<StyledTableCell align="center">
								Funções
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{materias.map((materia) => (
							<StyledTableRow>
								<StyledTableCell
									component="th"
									scope="row"
									align="center"
								>
									{materia.titulo}
								</StyledTableCell>
								<StyledTableCell align="center">
									{materia.professor_nome}
								</StyledTableCell>
								<StyledTableCell align="center">
									<Button
										onClick={() => editarMateria(materia)}
										variant="text"
									>
										<ModeEditIcon />
									</Button>
									<Button
										onClick={() => deletarMateria(materia)}
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
		<Box sx={{ width: "100%" }}>
			<LinearProgress color="secondary" />
		</Box>
	);
};
export default MateriasListagem;
