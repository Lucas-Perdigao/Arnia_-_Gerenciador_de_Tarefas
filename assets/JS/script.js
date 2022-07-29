//API LISTENER
// json-server --watch db.json

/////////////////////////--VARIABLES--/////////////////////////////


//Variável que armazena o cabeçalho das tarefas
let taskTitles = `<div class="row topTasks mt-2 mb-2">
                    <div class="col-2 col-sm-2 taskTitle" id="numCategory"><span onclick="sortTasks('num', 'desc')">Núm     <i class="fa-solid fa-sort-down"></i></span></div>
                    <div class="col-3 col-sm-4 taskTitle" id="descCategory"><span onclick="sortTasks('desc', 'desc')">Descrição     <i class="fa-solid fa-sort-down"></i></span></div>
                    <div class="col-3 col-sm-2 taskTitle" id="dateCategory"><span onclick="sortTasks('date', 'desc')">Data     <i class="fa-solid fa-sort-down"></i></span></div>
                    <div class="col-3 col-sm-2 taskTitle" id="statusCategory"><span onclick="sortTasks('status', 'desc')">Status     <i class="fa-solid fa-sort-down"></i></span></div>
                    <div class="col-1 col-sm-2 taskTitle">Ação</div>
                </div>`

//Variável que armazena o valor da configuração de confirmação ou não para excluir uma tarefa. Por padrão, o valor é true
var confirmDelete = true

//Variável que armazena o valor da configuração da quantidade de tarefas listadas na página. Por padrão, o valor é 10
var quantityPaginate = "10"

//Variável que armazena o valor da página da navegação. Por padrão, o valor é 1
var pageNumber = 1
                

//////////////////////////////--FUNÇÃO DE LOADING--//////////////////////////////


function loading(){
    window.setTimeout(()=>{
        document.getElementById("loading").style.display = "none"
    }, 1000)
}


    
//////////////--FUNÇÕES PARA ABRIR E FECHAR MODAL--////////////




//Função para abrir o modal de adicionar tarefa
function openModal(){
    document.getElementById("modalTitle").innerHTML = "Adicionar nova tarefa"
    document.getElementById("saveButtonDiv").innerHTML = `<button class="button" onclick="addTask()">Salvar</button>`
    document.getElementById("saveExitButtonDiv").innerHTML =  `<button class="button" onclick="addTask('close')">Salvar e fechar</button>`

    let modal = document.getElementById("modal");
    modal.classList.remove("animate__fadeOut", "d-none")
    modal.classList.add("animate__fadeIn")
}




//Função para fechar o modal e resetar os valores guardados no formulário
function closeModal(){
    let modal = document.getElementById("modal");
    modal.classList.remove("animate__fadeIn")
    modal.classList.add("animate__fadeOut")

    window.setTimeout(() => {
        modal.classList.remove("animate__fadeIn")
        modal.classList.add("d-none")
        document.getElementById("formNum").value = ""
        document.getElementById("formDesc").value = ""
        document.getElementById("formDate").value = ""
        document.getElementById("formStatus").value = ""
        document.getElementById("numNecessary").innerHTML = ""
        document.getElementById("descNecessary").innerHTML = ""
        document.getElementById("dateNecessary").innerHTML = ""
        document.getElementById("numNecessary").innerHTML = ""
    }, 1000)
}




//Função para abrir o modal de edição e recuperar os dados do HTML para o novo formulário
function openEditModal(id){
    openModal()
    document.getElementById("modalTitle").innerHTML = "Editar tarefa"
    document.getElementById("saveExitButtonDiv").innerHTML =  `<button class="button" onclick="editTask(${id})">Salvar e fechar</button>`
    document.getElementById("saveButtonDiv").innerHTML = ""

    document.getElementById("formNum").value = document.getElementById(`num${id}`).innerHTML
    document.getElementById("formDesc").value = document.getElementById(`desc${id}`).innerHTML
    document.getElementById("formDate").value = document.getElementById(`date${id}`).innerHTML
    document.getElementById("formStatus").value = document.getElementById(`status${id}`).innerHTML
}




//Função para abrir o modal de confirmação de exclusão de uma tarefa OU apagar a tafera diretamente caso seja a opção escolhida na configuração
function openDeleteModal(id){
    
    
    if(confirmDelete == true){
        let modal = document.getElementById("modalDelete");
        modal.classList.remove("animate__fadeOut", "d-none")
        modal.classList.add("animate__fadeIn")

        document.getElementById("deleteButtonDiv").innerHTML = `<button class="button" onclick="deleteTask(${id})">Sim, excluir</button>`

    } else{
        console.log('teste')
        deleteTask(id)
    }
}




function closeModalDelete(){
    let modal = document.getElementById("modalDelete");
    modal.classList.remove("animate__fadeIn")
    modal.classList.add("animate__fadeOut")

    window.setTimeout(() => {
        modal.classList.remove("animate__fadeIn")
        modal.classList.add("d-none")
    }, 1000)
}




///////////////////////////////////////--FUNÇÕES DE ESCRITA NA TELA, GET, PUT, POST E DELETE--///////////////////////////////////////





//Função para escrever a obrigação do conteúdo nos campos do formulário
function checkNecessary(formID, pageElement){
    if(formID == ""){
        pageElement.innerHTML = "*Campo obrigatório"
    } else {
        pageElement.innerHTML = ""
    }

}





//Cria função para injetar no HTML uma tarefa singular, usando informações tiradas da API
let injectHTML = (data) =>{
    let classStatusColor = verifyStatus(data.status)
    document.getElementById("listTasks").innerHTML = document.getElementById("listTasks").innerHTML + 
    `<li id="task${data.id}">
        <div class="singleTask row">
            <div class="col-2 wordbreak" id="num${data.id}">${data.num}</div>
            <div class="col-4 wordbreak" id="desc${data.id}">${data.desc}</div>
            <div class="col-2" id="date${data.id}">${data.date.split('-').reverse().join('/')}</div>
            <div class="col-2 ${classStatusColor}" id="status${data.id}">${data.status}</div>
            <div class="col-2">
                    <span class="iconLine" onclick="openEditModal(${data.id})"> <i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="deleteButton iconLine" onclick="openDeleteModal(${data.id})"><i class="fa-solid fa-trash-can"></i></span>
            </div>
        </div>
    </li>`
}




//Função que imprime os dados da API na tela
let printData = async () => {
    let data
    //Busca os dados da API e salva em um vetor JSON
    if(quantityPaginate == "all"){
        let request = await fetch ("http://localhost:3000/tasks")
        data = await request.json()
        console.log(data)
    }else{
        let request = await fetch (`http://localhost:3000/tasks?_page=${pageNumber}&_limit=${quantityPaginate}`)
        data = await request.json()
        console.log(data)
    }


    //Reseta o conteúdo da tabela de tarefas para "zero", somente com os títulos, para que o conteúdo que havia antes não ser somado ao próximo
    document.getElementById("listTasks").innerHTML = taskTitles
    

    //Passa a função da injeção em todos os elementos do vetor
    data.forEach(injectHTML)


    //Retorna os botões dos filtros para a função de filtrar
    document.getElementById("filterButtonsList").innerHTML = 
    `<div id="filterFinishedDiv" class="me-1">
        <button class="button" id="filterFinished" onclick="filterStatus('Concluído', 'filterFinished')">Concluído</button>
    </div>
    <div id="filterOnGoingDiv" class="me-1">
        <button class="button" id="filterOnGoing" onclick="filterStatus('Em andamento', 'filterOnGoing')">Em andamento</button>
    </div>
    <div id="filterStoppedDiv" class="me-1">
        <button class="button" id="filterStopped" onclick="filterStatus('Parado', 'filterStopped')">Parado</button>
    </div>`


    //Desfaz a seleção do filtro
    document.getElementById(`filterButton`).classList.remove('filterOn')


    //Mostra ou esconde os botões de paginação de acordo com a quantidade de itens apresentados e a página atual
    pageButtonSettings(data)
}




//Função para verificar o status e mudar a cor do status de acordo com ele
function verifyStatus(param){
    let statusContent = ""
    if (param == "Concluído"){ 
        statusContent  = "colorGreen"
        } else if (param == "Em andamento") {
            statusContent = "colorOrange"
        } else{
            statusContent = "colorRed"
        }
        return statusContent
}




//Função que adiciona os valores do formulário em variáveis e adiciona a API
async function addTask(param){
    //Atribuição dos valores do formulários HTML em variáveis para manipulação
    let numTask = document.getElementById("formNum").value
    let descTask = document.getElementById("formDesc").value
    let dateTask = document.getElementById("formDate").value
    let statusTask = document.getElementById("formStatus").value



    //Validando de campos do formulário
    checkNecessary(numTask, document.getElementById("numNecessary"))
    checkNecessary(descTask, document.getElementById("descNecessary"))
    checkNecessary(dateTask , document.getElementById("dateNecessary"))
    checkNecessary(statusTask, document.getElementById("statusNecessary"))


    //Cria o objeto somente caso nenhum dos atributos seja vazio, e adiciona o objeto à API caso a condição seja verdadeira
    if (numTask !== "" && descTask !== "" && dateTask !== "" && statusTask !== ""){
        let singleTask = {
            num: parseInt(numTask),
            desc: descTask[0].toUpperCase() + descTask.slice(1),
            date: dateTask,
            status: statusTask
        }

        await fetch('http://localhost:3000/tasks/', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(singleTask),
        })

        //Alerta ao adicionar tarefas
        taskAlert("add")
    }


    //Reseta e fecha o modal após uso quando o botão for Salvar e Fechar
    if (param == "close"){
        closeModal()
    }

    printData()
}




//Função para deletar a tarefa que contém o botão, usando de parâmetro o ID dinâmico
async function deleteTask(id){
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        },
    })
    printData()
    taskAlert("remove")
    closeModalDelete()
}




//Função para editar a tarefa na API e depois imprimir na tela
async function editTask(id){

    //Atribuição dos valores do formulários HTML em variáveis para manipulação
    let numTask = document.getElementById("formNum").value
    let descTask = document.getElementById("formDesc").value
    let dateTask = document.getElementById("formDate").value
    let statusTask = document.getElementById("formStatus").value

    //Validando de campos do formulário
    checkNecessary(numTask, document.getElementById("numNecessary"))
    checkNecessary(descTask, document.getElementById("descNecessary"))
    checkNecessary(dateTask , document.getElementById("dateNecessary"))
    checkNecessary(statusTask, document.getElementById("statusNecessary"))

    await fetch (`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 
            num: numTask,
            desc: descTask,
            date: dateTask,
            status: statusTask
        }),
    })
    printData()
    taskAlert("edit")
    closeModal()
}




//Função com o alerta ao adicionar ou remover tarefas
function taskAlert(param){
    let alert = document.getElementById("alert")
    
    if (param == "add"){
        alert.innerHTML = "Tarefa cadastrada com sucesso!"
        alert.classList.add("alert-success", "animate__fadeInUp")
        alert.classList.remove("d-none")

        window.setTimeout(() =>{
            alert.classList.remove("animate__fadeInUp")
            alert.classList.add("animate__fadeOutDown")    
        }, 1000
        )
        
        window.setTimeout(() => {
            alert.classList.add("d-none")
            alert.classList.remove("animate__fadeOutDown", "alert-success")
        }, 1500)
    } else if (param == "remove"){
        alert.innerHTML = "Tarefa removida."
        alert.classList.add("alert-danger", "animate__fadeInUp")
        alert.classList.remove("d-none")

        window.setTimeout(() =>{
            alert.classList.remove("animate__fadeInUp")
            alert.classList.add("animate__fadeOutDown")    
        }, 1000
        )
        
        window.setTimeout(() => {
            alert.classList.add("d-none")
            alert.classList.remove("animate__fadeOutDown", "alert-danger")
        }, 1500)
    } else {
        alert.innerHTML = "Tarefa editada."
        alert.classList.add("alert-warning", "animate__fadeInUp")
        alert.classList.remove("d-none")

        window.setTimeout(() =>{
            alert.classList.remove("animate__fadeInUp")
            alert.classList.add("animate__fadeOutDown")    
        }, 1000
        )
        
        window.setTimeout(() => {
            alert.classList.add("d-none")
            alert.classList.remove("animate__fadeOutDown", "alert-danger")
        }, 1500)

    }
}




///////////////////////////////////////--FUNÇÕES ORDENADORAS--///////////////////////////////////////




//Função para mudar as funções de ordenar e os ícones nos botões do título das categorias das tabelas
let changeSortFunction = (category, sortType) =>{
    if (category == 'num' && sortType == 'desc'){
        document.getElementById("numCategory").innerHTML = `<span onclick="sortTasks('num', 'desc')">Núm     <i class="fa-solid fa-sort-down"></i></span>`
    } else if (category == 'num' && sortType == 'asc'){
        document.getElementById("numCategory").innerHTML = `<span onclick="sortTasks('num', 'asc')">Núm     <i class="fa-solid fa-sort-up"></i></span>`
    } else if (category == 'desc' && sortType == 'desc'){
        document.getElementById("descCategory").innerHTML = `<span onclick="sortTasks('desc', 'desc')">Descrição     <i class="fa-solid fa-sort-down"></i></span>`
    } else if (category == 'desc' && sortType == 'asc'){
        document.getElementById("descCategory").innerHTML = `<span onclick="sortTasks('desc', 'asc')">Descrição     <i class="fa-solid fa-sort-up"></i></span>`
    } else if (category == 'date' && sortType == 'desc'){
        document.getElementById("dateCategory").innerHTML = `<span onclick="sortTasks('date', 'desc')">Data     <i class="fa-solid fa-sort-down"></i></span></span>`
    } else if (category == 'date' && sortType == 'asc'){
        document.getElementById("dateCategory").innerHTML = `<span onclick="sortTasks('date', 'asc')">Data     <i class="fa-solid fa-sort-up"></i></span>`
    } else if (category == 'status' && sortType == 'desc'){
        document.getElementById("statusCategory").innerHTML = `<span onclick="sortTasks('status', 'desc')">Status     <i class="fa-solid fa-sort-down"></i></span>`
    } else if (category == 'status' && sortType == 'asc'){
        document.getElementById("statusCategory").innerHTML = `<span onclick="sortTasks('status', 'asc')">Status     <i class="fa-solid fa-sort-up"></i></span>`
    } 
}




//Função para ordernar os itens da lista de acordo com os parâmetros
async function sortTasks(category, sortType){
    let request = await fetch (`http://localhost:3000/tasks/?_sort=${category}&_order=${sortType}`)
    data = await request.json()
    console.log(data)

    //Reseta o conteúdo da tabela de tarefas para "zero", somente com os títulos, para que o conteúdo que havia antes não ser somado ao próximo
    document.getElementById("listTasks").innerHTML = taskTitles

    //Muda a função no botão para a função de ordenamento contrária
    if(sortType == 'desc'){
        changeSortFunction(category, 'asc')
    } else if (sortType == 'asc'){
        changeSortFunction(category, 'desc')
    }


    //Passa a função da escrita em todos os elementos do vetor
    data.forEach(injectHTML)
}




///////////////////////////////////////--FUNÇÕES DE FILTRO, CONFIGURAÇÕES, TEMA E PESQUISA--///////////////////////////////////////




//Função que filtra na tela pelo tipo do status
async function filterStatus(statusType, filterId){
    let request = await fetch (`http://localhost:3000/tasks/?status_like=${statusType}`)
    data = await request.json()
    console.log(data)



    //Reseta o conteúdo da tabela de tarefas para "zero", somente com os títulos, para que o conteúdo que havia antes não ser somado ao próximo
    document.getElementById("listTasks").innerHTML = taskTitles



    //Passa a função da escrita em todos os elementos do vetor
    data.forEach(injectHTML)


    
    //Cria a ilusão de selecionar um botão ao preencher ele com cor, faz clicar no mesmo botão selecionado retornar a apresentar todos
    //Faz com que somente um filtro possa ser ativo por vez
    if(filterId == "filterFinished"){
        document.getElementById("filterFinishedDiv").innerHTML = `<button class="button" id="filterFinished" onclick="printData()">Concluído</button>`
        document.getElementById(`filterFinished`).classList.add('filterOn')
        document.getElementById(`filterOnGoing`).classList.remove('filterOn')
        document.getElementById(`filterStopped`).classList.remove('filterOn')
        document.getElementById(`filterButton`).classList.add('filterOn')
   
    } else if (filterId == "filterOnGoing") {
        document.getElementById("filterOnGoingDiv").innerHTML = `<button class="button" id="filterOnGoing" onclick="printData()">Em andamento</button>`
        document.getElementById(`filterOnGoing`).classList.add('filterOn')
        document.getElementById(`filterFinished`).classList.remove('filterOn')
        document.getElementById(`filterStopped`).classList.remove('filterOn')
        document.getElementById(`filterButton`).classList.add('filterOn')
    } else if (filterId == "filterStopped"){
        document.getElementById("filterStoppedDiv").innerHTML = `<button class="button" id="filterStopped" onclick="printData()">Parado</button>`
        document.getElementById(`filterStopped`).classList.add('filterOn')
        document.getElementById(`filterFinished`).classList.remove('filterOn')
        document.getElementById(`filterOnGoing`).classList.remove('filterOn')
        document.getElementById(`filterButton`).classList.add('filterOn')
    }


    // Como o filtro automaticamente quebra o paginamento por conta da API, é necessário fazer as exibições de uma página com exibição completa
    quantityPaginate = "all"

    document.getElementById("collapseConfigPaginate").innerHTML = `
        <button class="button" style="width: 240px;" onclick="changePaginate('10')">
                    Paginamento: todos
        </button>`

    document.getElementById("previousPageDiv").style.display = "none"
    document.getElementById("nextPageDiv").style.display = "none"
}




//Função que pesquisa nas tarefas pelo valor do input
async function search(){
    let searchItem = document.getElementById("formSearch").value

    let request = await fetch (`http://localhost:3000/tasks/?q=${searchItem}`)
    data = await request.json()
    console.log(data)

    //Reseta o conteúdo da tabela de tarefas para "zero", somente com os títulos, para que o conteúdo que havia antes não ser somado ao próximo
    document.getElementById("listTasks").innerHTML = taskTitles

    //Passa a função da escrita em todos os elementos do vetor
    data.forEach(injectHTML)
}




//Função que muda o botão de filtro --------------- MELHORAR --------- CONSERTAR FILTRO/PAGINAÇÃO
function swapFilterIcon(openOrClose){
    if (openOrClose == "open"){
        document.getElementById("filterButtonDiv").innerHTML = 
        `<button class="button" id="filterButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter" onclick="swapFilterIcon('close')"><i id="filterIcon" class="fa-solid fa-circle-chevron-up"></i>     Filtros</i></button>`

        } else if (openOrClose == "close"){
            document.getElementById("filterButtonDiv").innerHTML = 
            `<button class="button" id="filterButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter" onclick="swapFilterIcon('open')"><i id="filterIcon" class="fa-solid fa-circle-chevron-down"></i>     Filtros</i></button>`
    }


}



//Função que muda as opções de exclusão de tarefas
function changeDeleteConfig(yesOrNo){
    if(yesOrNo == "yes"){
        confirmDelete = false

        document.getElementById("collapseConfigDelete").innerHTML = 
        `<button class="button" style="width: 250px;" onclick="changeDeleteConfig('no')">
        Confirmar exclusão: não
        </button>`
    } else{
        confirmDelete = true

        document.getElementById("collapseConfigDelete").innerHTML = 
        `<button class="button" style="width: 250px;" onclick="changeDeleteConfig('yes')">
        Confirmar exclusão: sim
        </button>`
    }


}


//Função que muda o tema das cores
function changeTheme(theme){
    if (theme == "dark"){
        document.getElementById('stylesheet').setAttribute("href", "assets/CSS/style-dark.css")
        document.getElementById('collapseConfigTheme').innerHTML = 
            `<button class="button" style="width: 140px;" onclick="changeTheme('white')">
                <i class="fa-solid fa-circle-half-stroke"></i>  Tema
            </button>`
        document.getElementById("iconeArnia").innerHTML = `<img class="img-fluid" src="assets/images/logoArniaWhite.png"></img>`
    } else{
        document.getElementById('stylesheet').setAttribute("href", "assets/CSS/style-normal.css")
        document.getElementById('collapseConfigTheme').innerHTML = 
            `<button class="button" style="width: 140px;" onclick="changeTheme('dark')">
                <i class="fa-solid fa-circle-half-stroke"></i>  Tema
            </button>`
            document.getElementById("iconeArnia").innerHTML = `<img class="img-fluid" src="assets//images/logoArniaDark.png"></img>`
    }
}


///////////////////////////////////////--FUNÇÕES DE PAGINAÇÃO--///////////////////////////////////////




//Função que muda o estilo da paginação
function changePaginate(numPerPage){
    if (numPerPage == '10'){
        quantityPaginate = '10'

        document.getElementById("collapseConfigPaginate").innerHTML = `
        <button class="button" style="width: 240px;" onclick="changePaginate('20')">
                    Paginamento: 10 itens
        </button>`

        console.log("Quantidade de itens: " + quantityPaginate)
        console.log("Página: " + pageNumber)
        printData()

    } else if(numPerPage == '20'){
        quantityPaginate = '20'
        
        document.getElementById("collapseConfigPaginate").innerHTML = `
        <button class="button" style="width: 240px;" onclick="changePaginate('all')">
                    Paginamento: 20 itens
        </button>`

        console.log("Quantidade de itens: " + quantityPaginate)
        console.log("Página: " + pageNumber)
        printData() 
    } else if (numPerPage == "all"){
        quantityPaginate = "all"

        document.getElementById("collapseConfigPaginate").innerHTML = `
            <button class="button" style="width: 240px;" onclick="changePaginate('10')">
                        Paginamento: todos
            </button>`

        console.log("Quantidade de itens: " + quantityPaginate)
        console.log("Página: " + pageNumber)
        printData()
    }
}



//Função que avança ou retorna de página
function changePage(page){
    if (page == "next"){
        pageNumber++
        printData()
        console.log("Quantidade de itens: " + quantityPaginate)
        console.log("Página: " + pageNumber)

    }else if (page == "back"){
        pageNumber--
        printData()
        console.log("Quantidade de itens: " + quantityPaginate)
        console.log("Página: " + pageNumber)
    }
}



//Função que mostra ou esconde os botões da paginação
function pageButtonSettings(array){
    //Some com os botões de mudança de página se exibir todas as tarefas
    if(quantityPaginate == "all"){
        document.getElementById("previousPageDiv").style.display = "none"
        document.getElementById("nextPageDiv").style.display = "none"
    }else{
        document.getElementById("previousPageDiv").style.display = "block"
        document.getElementById("nextPageDiv").style.display = "block"
    }

    //Some com o botão de retorno de página caso esteja na página 1
    if(pageNumber == 1){
        document.getElementById("previousPageDiv").style.display = "none"
    }else if (pageNumber !==1 && quantityPaginate == "all"){
        document.getElementById("previousPageDiv").style.display = "none"
    }else{
        document.getElementById("previousPageDiv").style.display = "block"
    }

    //Some com o botão de avanço de página caso não tenha mais elementos para exibir
    if(array.length == 0){
        document.getElementById("nextPageDiv").style.display = "none"
    }else if (array.length < quantityPaginate){
        document.getElementById("nextPageDiv").style.display = "none"
    }else if (array.length !== 0 && quantityPaginate == "all"){
        document.getElementById("nextPageDiv").style.display = "none"
    }else{
        document.getElementById("nextPageDiv").style.display = "block"
    }
}




///////////////////////-- INIT -- ///////////////////////


//Carregamento fake da página
window.addEventListener("load", (event) => {
    loading()})




//Chama a função de imprimir os dados ao carregar a tela
printData()


console.log("Quantidade de itens: " + quantityPaginate)
console.log("Página: " + pageNumber)




//Registra o apertar do enter para realizar a pesquisa do campo
window.addEventListener('load', (event) => {
    document.getElementById('formSearch').addEventListener('keypress', logKey)

    function logKey(e) {
        if (e.key === 'Enter') {
            search()
          }
          
    console.log(e.code)
    }
  })




