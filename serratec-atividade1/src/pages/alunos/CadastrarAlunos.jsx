import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
	ButtonCadastro,
	Form,
	InputCadastro,
} from "../../components/Cadastros";
import { API_URL } from "../../constants";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams } from "react-router";
import { AlunosContext } from "../../context/alunos";
import { Box } from "@mui/system";
import Lottie from "react-lottie"; // import do lotties, qualquer coisa muda pro seu import
import animationData from "../../lotties/78259-loading.json"; // arquivo baixado do lotties

const CadastrarAlunos = () => {
	const MySwal = withReactContent(Swal);

	// Desestrutura o id para receber o id que vem daquela rota
	const { id } = useParams();

	// Metodo para arrumar as info na hora de edição de aluno, no placeholder
	const valorInicial = id ? " " : null;

	const [nome, setNome] = useState(valorInicial);
	const [idade, setIdade] = useState(valorInicial);
	const [cidade, setCidade] = useState(valorInicial);

	const { alunos, setAlunos } = useContext(AlunosContext);

	useEffect(() => {
		getAlunos();
	}, []);

	//Get utilizado para quando entrar na tela de edição puxar os alunos
	//Get Direto da API, a cada renderização faz um request
	// const getAlunos = () => {
	// 	axios.get(API_URL).then((response) => {
	// 		response.data.forEach((aluno) => {
	// 			// 			//Para não renderizar todos os alunos dando o set, botamos uma
	// 			// 			//condição para renderizar somente aquele que venha com o id igual
	// 			if (aluno.id == id) {
	// 				setNome(aluno.nome);
	// 				setIdade(aluno.idade);
	// 				setCidade(aluno.cidade);
	// 			}
	// 		});
	// 	});
	// };

	//Pegar os dados diretamente do nosso context e economizar requests
	const getAlunos = () => {
		alunos.forEach((aluno) => {
			if (aluno.id == id) {
				setNome(aluno.nome);
				setIdade(aluno.idade);
				setCidade(aluno.cidade);
			}
		});
	};

	const cadastrarAlunos = () => {
		//Se caso o aluno já conter ID irá fazer o put **Atualizar**
		if (id) {
			axios
				.put(API_URL, {
					id,
					nome,
					idade,
					cidade,
				})
				.then((response) => {
					if (response.status === 200) {
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
				.post(API_URL, {
					nome,
					idade,
					cidade,
				})
				.then((response) => {
					if (response.status === 201) {
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

	const limparCampos = () => {
		setNome("");
		setIdade("");
		setCidade("");
	};
	
	const defaultOptions = { // configuracao padrao do loading do lotties
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

	return (
    <Box sx={{ marginTop: "25px" }}>
      {alunos.length > 0 ? (
        <Form>
          <InputCadastro
            label="Nome"
            variant="outlined"
            value={nome} //pra depois que cadastrar ele colocar valor vazio que vem da funcao liparcampos
            onChange={(e) => setNome(e.target.value)} //o evento onchange altera os estados
          />
          <InputCadastro
            label="Idade"
            variant="outlined"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
          <InputCadastro
            label="Cidade"
            variant="outlined"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />

          <ButtonCadastro variant="contained" onClick={cadastrarAlunos}>
            {id ? "Editar" : "Cadastrar"}
          </ButtonCadastro>
        </Form>
      ) : (
        <Lottie options={defaultOptions} height={400} width={400} />
      )}
    </Box>
  );
};

export default CadastrarAlunos;
