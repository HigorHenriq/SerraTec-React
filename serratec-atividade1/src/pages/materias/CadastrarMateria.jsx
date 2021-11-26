import * as React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
	Form,
	InputCadastro,
	ButtonCadastro,
} from "../../components/Cadastros";
import { API_MATERIAS } from "../../constants";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MateriasContext } from "../../context/materias";
import Lottie from "react-lottie"; // import do lotties
import animationData from "../../lotties/78259-loading.json"; //imagem baixada do lotties
import { Box } from "@mui/system";

const CadastrarMateria = () => {
	const MySwal = withReactContent(Swal);

	const { id } = useParams();

	const valorInicial = id ? " " : null;

	const [titulo, setTitulo] = useState(valorInicial);
	const [professor_nome, setProfessor_nome] = useState(valorInicial);

	const { materias, setMaterias } = useContext(MateriasContext);

	useEffect(() => {
		getMaterias();
	}, []);

	const getMaterias = () => {
		if (materias.length > 0) {
			materias.forEach((materia) => {
				//para cada aluno solicitado
				if (materia.id == id) {
					//confere se os ids sao iguais e coloca os dados do aluno solicitado
					setTitulo(materia.titulo);
					setProfessor_nome(materia.professor_nome);
				}
			});
		} else {
			axios.get(API_MATERIAS).then((response) => {
				setMaterias(response.data);
				response.data.forEach((materia) => {
					//para cada materia solicitado
					if (materia.id === parseInt(id)) {
						//confere se os ids sao iguais e coloca os dados do materia solicitado
						setTitulo(materia.titulo);
						setProfessor_nome(materia.professor_nome);
					}
				});
			});
		}
	};

	const cadastrar = () => {
		//Se caso o aluno já conter ID irá fazer o put **Atualizar**
		if (id) {
			axios
				.put(API_MATERIAS, {
					id,
					titulo,
					professor_nome,
				})
				.then((response) => {
					if (response.status === 200) {
						axios.get(API_MATERIAS).then((response) => {
							setMaterias(response.data);
						});
						MySwal.fire({
							icon: "success",
							text: response?.data?.message,
						});
						limparCampos();
					}
				})
				.catch((error) => {
					MySwal.fire({
						icon: "error",
						title: "Oops...",
						text: error,
					});
				});
		} else {
			axios
				.post(API_MATERIAS, {
					titulo,
					professor_nome,
				})
				.then((response) => {
					if (response.status === 201) {
						axios.get(API_MATERIAS).then((response) => {
							setMaterias(response.data);
						});
						MySwal.fire({
							icon: "success",
							text: response?.data?.message,
						});
						limparCampos();
					}
				})
				.catch((error) => {
					MySwal.fire({
						icon: "error",
						title: "Oops...",
						text: error,
					});
				});
		}
	};

	//FUNCAO PARA
	const limparCampos = () => {
		setTitulo("");
		setProfessor_nome("");
	};
	
	const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

	return (
    <Box sx={{ marginTop: "25px" }}>
      {materias.length > 0 ? (
        <Form>
          <InputCadastro
            label="Materia"
            variant="outlined"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <InputCadastro
            label="Professor"
            variant="outlined"
            value={professor_nome}
            onChange={(e) => setProfessor_nome(e.target.value)}
          />

          <ButtonCadastro variant="contained" onClick={cadastrarMaterias}>
            {id ? "Editar" : "Cadastrar"}
          </ButtonCadastro>
        </Form>
      ) : (
        <Lottie options={defaultOptions} height={400} width={400} />
      )}
    </Box>
  );
};

export default CadastrarMateria;
