const API = "http://localhost:8000";

let token = "";

async function login(){

    const usuario = document.getElementById("username").value;

    const senha = document.getElementById("password").value;

    const resposta = await fetch(`${API}/auth/login`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:usuario,

            password:senha

        })

    });

    if(!resposta.ok){

        alert("Usuário ou senha inválidos!");

        return;

    }

    const dados = await resposta.json();

    token = dados.access_token;

    document.getElementById("login").style.display="none";

    document.getElementById("app").style.display="block";

    listarTarefas();

}

function logout(){

    token="";

    document.getElementById("app").style.display="none";

    document.getElementById("login").style.display="block";

}

async function listarTarefas(){

    const resposta = await fetch(`${API}/tasks`,{

        headers:{
            Authorization:`Bearer ${token}`
        }

    });

    const tarefas = await resposta.json();

    const lista = document.getElementById("lista");

    lista.innerHTML="";

    tarefas.forEach(t=>{

        lista.innerHTML+=`

        <li>

            <strong>${t.title}</strong><br>

            ${t.description ?? ""}<br>

            Status: ${t.status}<br>

            Prioridade: ${t.priority}<br>

            <button class="excluir" onclick="excluir(${t.id})">

                Excluir

            </button>

        </li>

        `;

    });

}

async function criarTarefa(){

    const titulo=document.getElementById("titulo").value;

    const descricao=document.getElementById("descricao").value;

    const prioridade=document.getElementById("prioridade").value;

    await fetch(`${API}/tasks`,{

        method:"POST",

        headers:{

            "Content-Type":"application/json",

            Authorization:`Bearer ${token}`

        },

        body:JSON.stringify({

            title:titulo,

            description:descricao,

            status:"pending",

            priority:prioridade

        })

    });

    document.getElementById("titulo").value="";

    document.getElementById("descricao").value="";

    listarTarefas();

}

async function excluir(id){

    await fetch(`${API}/tasks/${id}`,{

        method:"DELETE",

        headers:{

            Authorization:`Bearer ${token}`

        }

    });

    listarTarefas();

}