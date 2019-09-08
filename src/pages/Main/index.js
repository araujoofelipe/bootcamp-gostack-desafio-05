import React,{Component} from 'react';
import { FaGithubAlt,FaPlus,FaSpinner} from 'react-icons/fa'
import { Form,SubmitButton,List } from './styles';
import Container from '../../components/Container';
import { Link } from 'react-router-dom';
import api from '../../services/api';
class Main extends Component{
   state = {
    newRepo:'',
    repositories:[],
    loading:false,
    error:null,

   };
   //carregar os dados do local storage
    componentDidMount(){
        const repositories = localStorage.getItem('repositories');

        if(repositories){
            this.setState({repositories:JSON.parse(repositories)})
        }
    }
    //salvar os dados no local storage
    componentDidUpdate(_,prevState){
        const {repositories } = this.state;
        if(this.state.repositories != prevState.repositories){
                localStorage.setItem('repositories',JSON.stringify(repositories));
        }

    }
   handleInputChange = e =>{
       this.setState({newRepo:e.target.value});

   };
    handleSubmit = async e =>{
        e.preventDefault();
        this.setState({loading:true, error: false});


        try{
            const { newRepo,repositories } = this.state

            if(newRepo === '') throw 'Você precisa inserir um repositório';

            const hasRepo = repositories.find(r => r.name ===newRepo);

            if(hasRepo) throw 'Este repositório já existe';

            const response = await api.get(`/repos/${newRepo}`);

            if(!response) throw 'Este repositório não existe';
            const data = {
                name:response.data.full_name,
            }

            this.setState({
                repositories:[... repositories,data],
                newRepo: '',
                loading:false
            })
        }catch(error){
            alert(error)
            this.setState({error:true})
        }finally{
            this.setState({loading:false});
        }


    };

    render() {
    const { newRepo,loading,repositories,error } = this.state;
    return (
        <Container >
        <h1>
            <FaGithubAlt />
            Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>

            <input type="text" placeholder="Adcionar repositório" value={newRepo} onChange={this.handleInputChange}/>
            {/* {error ?<small>Algo deu errado</small> : ''} */}
        <SubmitButton  loading={loading}>
        {loading ?<FaSpinner color="#FFF" size={14} /> : <FaPlus color="#FFF" size={14}  />}

        </SubmitButton>
        </Form>
        <List>
        {repositories.map(repository =>(
        <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`} >Detalhes</Link>
        </li>
        ))}
        </List>
        </Container>
    );
  }
}
export default Main;
