
//recupera cotações pela api
function recuperaCotacoesMap() {
    tipo = "Cotacao"
    texto = ""
    const div = document.getElementById("texto");
    fetch('https://prod-110.westus.logic.azure.com/workflows/e50f80756b9b43baa71d055fbee3d9c6/triggers/manual/paths/invoke/tipo/' + tipo + '?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MUPtVkRaZGh1maM7uzFu2cmmaebhC1aKvLcfMfhirw0', options)
        .then(response => {
            response.json()

                .then(data => {
                    const lista_cotacao = data.value;

                    lista_cotacao.map((dado) => {
                        texto += `Data: ${formataData(dado.data)} - R$ ${(dado.valor.replace(".", ","))} `
                    }
                    )
                    div.innerHTML += `  ${texto} `
                })
        })
        .catch(e => {
            console.log("ERRO: " + e)
        })
}

//função para imprimir as receitas em modo lista
function trataListas(list) {
    var lista = ""

    for (indexIngredientes = 0; indexIngredientes < list.length; indexIngredientes++) {
        item = "<li>" + list[indexIngredientes] + "</li>"
        lista += item

    }
    return lista
}
//monta o feed recuperando os dados pela api
function imprimeFeedReceitasApi(id, valorPesquisa) {
    post = ""
    tipo = "Receitas"
    const div = document.getElementById("postsFeed");
    console.log(valorPesquisa)
    fetch('https://prod-110.westus.logic.azure.com/workflows/e50f80756b9b43baa71d055fbee3d9c6/triggers/manual/paths/invoke/tipo/' + tipo + '?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MUPtVkRaZGh1maM7uzFu2cmmaebhC1aKvLcfMfhirw0', options)
        .then(response => {
            response.json()

                .then(data => {
                    const feedFiltrado = data.value;
                    console.log(feedFiltrado)                 
                    var lista_cotacao = feedFiltrado.filter(function (el) {
                        return ((el.idusuario == id || el.idusuario == undefined) && (el.ingredientes.includes(valorPesquisa) || el.titulo.includes(valorPesquisa) || valorPesquisa== undefined || el.modopreparo.includes(valorPesquisa)));
                    })
                    console.log("F",lista_cotacao)
                   
                    lista_cotacao.map((dado) => {
                        console.log("dado",dado)
                        Ingredientes = titleCase(dado.ingredientes).split("\n")
                        listaIngredientes = trataListas(Ingredientes)

                        modoPerparo = titleCase(dado.modopreparo).split("\n")
                        listaModos = trataListas(modoPerparo)
                        post += `<div class='card' >
                                    <title>Placeholder</title><rect width='100%' height='100%'>
                                    <img src="${dado.imagem}" class='card-img-top'>  
                                    
                                    <div class='card-body'>
                                        <h5 class='card-title'> ${dado.titulo} </h5>                                    
                                        <p class='card-text'> <b>Ingredientes</b> <ul> ${listaIngredientes} </ul> </p>
                                        <p class='card-text'> <b>Modo de Preparo</b> <ol> ${listaModos} </ol> </p>
                                        
                                        <div class="row">
                                            <div class="mb-3 col-md-10">
                                                <input class="form-control me-3" type="search" placeholder="Comentar" aria-label="Search">
                                            </div>
                                            <div class="mb-3 col-md-2">
                                                <button class='btn btn-primary'>Comentar</button>
                                            </div>
                                         </div>                                        
                                      </div>
                                    </div> <br>                                    `
                    }
                    )

                    div.innerHTML += post;
                })
        })
        .catch(e => {
            console.log("ERRO: " + e)
        })
}

//função para filtrar as receitas
function pesquisaFeed() {
    var idUsuario = location.search.substring(1);
    console.log(idUsuario)
    console.log("1",document.getElementById("pesquisaFeed").value)
    imprimeFeedReceitasApi(idUsuario, document.getElementById("pesquisaFeed").value)
}
/*
function postarFeed() {
    var novoFeed = {
        "id": feed.length + 1,
        "titulo": document.getElementById("postarTitulo").value,
        "texto": document.getElementById("postarTexto").value,
        "idusuario": location.search.substring(1)
    }

    feed.push(novoFeed)
    console.log(feed)
    pesquisaFeed()
}*/