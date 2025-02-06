let header= document.createElement("section")
header.innerHTML= `  <div class="container">
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
        <span class="fs-4">El Trust Joyero</span>
      </a>
      <ul class="nav nav-pils">
        <li class="nav-item"><a href="#" class="nav-link " aria-current="page">Inicio</a></li>
        <li class="nav-item "><a href="#" class="nav-link">Nosotros</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Productos</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Locales</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Contacto</a></li>
      </ul>
    </header>
  </div>`
document.body.appendChild(header)

let main= document.createElement("main")
main.innerHTML=`<div id="carouselExampleRide" class="carousel slide" data-bs-ride="true">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://www.casademexico.es/wp-content/uploads/2020/02/photo-1536502829567-baf877a670b5.jpg" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://thumbs.dreamstime.com/b/joyer%C3%ADa-de-oro-en-una-ventana-de-tienda-41774824.jpg" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://carlosmoret.es/wp-content/uploads/2022/12/joya-de-oro.jpg" class="d-block w-100" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
<br>
<br>
<div class="d-grid gap-2 col-6 mx-auto">
        <button id="agregar" class="btn btn-primary" type="button">Agregar Producto</button>
        <button id="filtrar" class="btn btn-light" type="button">Filtrar Producto</button>
    </div>
`
document.body.appendChild(main)

const Producto = function(nombre, precio, stock){
    this.nombre= nombre
    this.precio = precio
    this.stock = stock
}
let producto1  = new Producto("Pulsera oro 18k",10000,2)
let producto2  = new Producto("Rolex 18k",2500000,1)
let producto3  = new Producto("Cadena Hombre 18k",1850000,1)
let producto4  = new Producto("Cadena Mujer 18k",1200000,1)

let lista = [producto1,producto2,producto3,producto4]

if(localStorage.getItem("productos")){
    lista = JSON.parse(localStorage.getItem("productos"))
}else{
    lista=lista
}

function filtrarProducto(){
    Swal.fire({
        title: 'Ingresá el nombre del producto que desea buscar',
        input: 'text',
        showCancelButton: true,
        ConfirmButtonText:'Buscar',
        showLoaderOnConfirm: true,
        
        preConfirm: (palabraClave)=>{
            palabraClave = palabraClave.trim().toUpperCase()
            let resultado = lista.filter( (producto)=> producto.nombre.toUpperCase().includes(palabraClave))
            if(resultado.length >0){
                Swal.fire({
                    title:'Este es el resultado de tu búsqueda',
                    html:'<table><tr><th>Nombre</th><th>Precio</th><th>Stock</th></tr><table/>'+ 
                    resultado.map((producto)=> `<tr><td>${producto.nombre}</td><td>${producto.precio}</td><td>${producto.stock}</td>`),
                })
            }else{
                Swal.fire({
                    title:`no se encuentra coincidencias`,
                    icon:'error',
                    confirmButtonText: `ok`,
                })
            }
        }
    })
}

function agregarProducto(){
    Swal.fire({

        title:`Agregar Producto`,
        html:`<label>Nombre:</label> <input id="nombre-input" class="swal2-input" type="text" autofocus>
            <label>Precio:</label><input id="precio-input" class="swal2-input" type="number" step="0.01">
            <label>Stock:</label><input id="stock-input" class="swal2-input" type="number" step="1">`,
        showCancelButton: true,
        confirmButtonText:"Agregar",
        cancelButtonText: "Cancelar",
    }).then((result)=>{
        if(result.isConfirmed){
            let nombre = document.getElementById("nombre-input").value.trim();
            let precio = document.getElementById("precio-input").value.trim();
            let stock = document.getElementById("stock-input").value.trim();
            if(isNaN(precio) || isNaN(stock) || nombre===""){
                Swal.fire(
                    {
                        icon: "error",
                        title:"Error",
                        text:"por favor ingresa valores validos"
                    }
                ); return
            }
            let producto = new Producto(nombre,precio,stock)
            if (lista.some ((elemento)=> elemento.nombre === producto.nombre)){
                Swal.fire({
                    icon:"warning",
                    title: "Advertencia",
                    text:"El producto ya existe en la lista"
                }); return
                
            }
            lista.push(producto)

            localStorage.setItem("productos", JSON.stringify(lista))

            Swal.fire({
                icon:"succes",
                title:"Producto Agregado",
                text: `se agregó el producto con éxito${producto.nombre} a la lista`,
                timer: 3000
            })
            console.table(lista)
        }
    })
}

let agregar = document.getElementById("agregar")
agregar.addEventListener("click",agregarProducto)

let filtrar = document.getElementById("filtrar")
filtrar.addEventListener("click",filtrarProducto)

let URL= `https://api.metalpriceapi.com/v1/symbols?api_key=6e7b1a552ff611b09faf316971d7586b`

const monedasContainer = document.createElement("section");
document.body.appendChild(monedasContainer)

fetch(URL)
.then(response => response.json())
.then(data => {
  const monedas = data.results;

  monedas.forEach((moneda) => {
    fetch(moneda.url)
    .then(response => response.json())
    .then(monedaData => {
      const monedaElement = document.createElement(`div`);
      monedaElement.innerHTML = `<h2>${monedaData.symbols}`;
      monedasContainer.appendChild(monedaElement);
    })
    .catch(error =>{
      console.error(`Ha ocurrido un error`, error);
    });
  });
})
.catch(error => {
  console.error(`Ha ocurrido un error`);
});
