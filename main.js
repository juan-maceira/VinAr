document.addEventListener("DOMContentLoaded", ()=>{
    
    cargarCarritoLocalStorage();
    imprimirCarrito();
    
});


//array de objetos con todos los vinos
// const vinos =
// [
//     {
//         "id": 1,
//         "nombre": "FINCA LA LINDA",
//         "uva": "Malbec",
//         "bodega": "Bodega: Luigi Bosca",
//         "img": "img/finca.png",
//         "precio": 55,
//     },

//     {
//         "id": 2,
//         "nombre": "LUIGI BOSCA",
//         "uva": "Malbec",
//         "bodega": "Bodega: Luigi Bosca",
//         "img": "img/bosca.png",
//         "precio": 74,
//     },

//     {
//         "id": 3,
//         "nombre": "DV CATENA",
//         "uva": "Cabernet-Malbec",
//         "bodega": "Bodega: Catena Zapata",
//         "img": "img/dv.png",
//         "precio": 89,
//     },

//     {
//         "id": 4,
//         "nombre": "ALAMOS",
//         "uva": "Malbec",
//         "bodega": "Bodega: Catena Zapata",
//         "img": "img/alamos.png",
//         "precio": 63,
//     },

//     {
//         "id": 5,
//         "nombre": "NICASIA",
//         "uva": "Malbec",
//         "bodega": "Bodega: Catena Zapata",
//         "img": "img/nicasia.png",
//         "precio": 69,
//     },

//     {
//         "id": 6,
//         "nombre": "TRUMPETER",
//         "uva": "Malbec",
//         "bodega": "Bodega: La Rural",
//         "img": "img/trumpeter.png",
//         "precio": 65,
//     }
// ];

//creo un array vacio para ir llenando
const carrito =  []; 


//Creo una funcion para imprimir los productos de mi dase de datos (vinos) en pantalla.
async function imprimirVinos() {

    const tienda = document.getElementById('tienda')  //capturo la etiqueta el id del html a donde voy a anidar los productos
    const response = await fetch('/vinos.json');
    const vinos = await response.json();

    vinos.forEach(({img, nombre, uva, bodega, precio, id})=> { //recorro el array de vinos para obtener todos los objetos

        let vino = document.createElement('div') // creo un elemento div en un variable llamada vino
        vino.classList.add('col-12') //le agrego varias clases de bootstrap
        vino.classList.add('col-md-4');
        vino.classList.add('mb-5');
        vino.classList.add('d-flex');
        vino.classList.add('justify-content-center');
        
        //al div 'vino' le inserto codigo html con los valores del array vinos entre ${}
        vino.innerHTML = `
        <div class="card text-dark" style="width: 18rem;">
            <img class="card-img-top" src="${img}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <h6 class="card-title">${uva}</h6>
                <h6 class="card-title">${bodega}</h6>
                <p>${precio} R$</p>
                <button class="btn btn-primary" id="${id}">Añadir al carrito</button>
            </div>
        </div>
        `
        
        tienda.appendChild(vino); //anido el div vino dentro de la etiqueta tienda de html

        vino.querySelector('button').addEventListener('click', ()=>{ //selecciono la etiqueta button dentro de vino y me pongo a escuchar los clicks en ese boton
            updateContador() // contador general
            agregarVinosAlCarrito(id); // invoco la function agregarVinosAlCarrito para que cuando escuche el click se ejecute la function
                  
        })
    }) 
}

imprimirVinos(); //invoco a la funcion para que se ejecute

async function agregarVinosAlCarrito(id) { // creo una funcion para comenzar a agregar vinos al array carrito. los voy a agregar por medio de su (id)
    const response = await fetch('/vinos.json');
    const vinos = await response.json();

    let vino = vinos.find(vino => vino.id === id); //creo una nueva variable vino que por el scope no interfiere con la variable vino declarada en la function imprimirVino()
    // aplico metodo de filtrado find para que  me de la primera coincidencia con mi base de datos
    // vino representa cada producto de mi base de datos.
    // obtengo la primera coincidenca de (vino.id) que sean iguales al (id) parametro de la function

    let vinoEnCarrito = carrito.find(vino => vino.id === id);
    // creo otra variable y con find busco la primer coincidencia de (vinos.id) pero no con array carrito y sus respectivo (id).

    if (vinoEnCarrito){ 
        //si hay un vino vino en el carrito encuentra coincidencia y suma cantidad de a uno
        vinoEnCarrito.cantidad++; //OPERADOR AVANZADO ++
        
        Swal.fire({
            icon: 'success',
            title: 'Excelente!',
            text: `Otra unidad de ${vino.nombre} se agrego correctamente al carrito`,
            timer: 2000
          })

    } else{  // sino encuentra coincidencia queda en 1
        carrito.push({
            ...vino,
            cantidad:1
        }); //agrego vino al carrito
        
        Swal.fire({
            icon: 'success',
            title: 'Excelente!',
            text: `1 unidad de ${vino.nombre} se agrego correctamente al carrito`,
            timer:2000
          })
    }
    

    imprimirCarrito(); //invoco la function imprimirCarrito para que se ejecute cuando se agrega un producto al carrito
    calcularTotal() //invoco la funcion total para siempre calcular el total segun sume o reste vinos del carrito
    guardarCarritoLocalStorage()
}



function eliminarVinoDelCarrito(index) {

    carrito[index].cantidad--;  //accede a la primera posición del array y resta de a uno
    //OPERADOR AVANZADO --
    Swal.fire({
        icon: 'warning',
        title: 'Atención!',
        text: `Haz eliminado 1 unidad de ${carrito[index].nombre}`,
        timer: 2000
      })

    if (carrito[index].cantidad === 0) { // cuando llegue a 0
      
        carrito.splice(index,1); // Se borra la card del carrito

        Swal.fire({
            icon: 'warning',
            title: 'Atención!',
            text: `Has eliminado ${ultimoProducto} del carrito`,
            timer: 2000
          })
    }


    imprimirCarrito(); // invoco esta funcion para volver a imprimir el carrito con los cambios en las cantidades
    calcularTotal(); // invoco esta funcion para que reste del total siempre que se eliminen vinos del carrito
    updateContador();
    guardarCarritoLocalStorage()
}

function imprimirCarrito (){ //creo la fuction para imprimir los vinos en el carrito de comprar cuando den click al button agregar al carrito.

    const c = document;
    let carritoPag = c.querySelector('#carrito');

    carritoPag.innerHTML = ''; // para limpiar el modal anterior (carrito) en caso de sumar mas productos e imprime la las cantidades de cada vino en una sola card por vino. para no repetir

    carrito.forEach(({img, nombre, uva, bodega, precio, cantidad}, index)=>{  //recibe cada producto (v) como 1er parametro y el index como 2do parametro(posición del objeto dentro del array carrito) 
        
        // creo un elemento div para imrprimir en el carrito y les doy clases de boostrap
        let vino = document.createElement('div') 
        vino.classList.add('col-12')
        vino.classList.add('col-md-4');
        vino.classList.add('mb-5');
        vino.classList.add('d-flex');
        vino.classList.add('justify-content-center');

        //inserto codigo html dendro del div vino y en vez de pasar el valor id, paso el valor cantidad
        vino.innerHTML = `
        <div class="card text-dark" style="width: 18rem;">
            <img class="card-img-top" src="${img}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <h6 class="card-title">${uva}</h6>
                <h6 class="card-title">${bodega}</h6>
                <p>${precio} R$</p>
                <p>Cantidad: ${cantidad}</p> 
                <button class="btn btn-danger">Eliminar</button>
            </div>
        </div>
        `

        // escucho el evento click del boton eliminar dentro de vino 
        vino.querySelector('button').addEventListener('click', ()=>{
            
            ultimoProducto = nombre;
            eliminarVinoDelCarrito(index) //invoco la funcion para que se ejecute simpre que den click al boton eliminar

        })

        carritoPag.appendChild(vino); //para anidar el div vino dentro del carrito en html
    })
    
    
    
}
let ultimoProducto;
function calcularTotal(){ // creo un funcion para calcular el valor total de vino en el carrito

    let total = 0; // creo una variable acumulador que comienza en 0

    carrito.forEach((v) =>{  //recorro el carrito porducto por producto para cualcular el total

        total += v.precio * v.cantidad; // precio x cantidad
    })

    const totalHtml = document.getElementById('total') //capturo de html la etiqueta con id total

    totalHtml.innerHTML = `<h5>Total R$ ${total}</h5>` //inserto la varible total declarada en la linea 203 dentro de la etiqueta total de html

}

function updateContador() {
    const carritoStorage = localStorage.getItem("carrito");
    let totalProductos = 0;

    if (carritoStorage !== null) {
        JSON.parse(carritoStorage).forEach((vino) => {
            totalProductos += vino.cantidad;  
        });    
        localStorage.setItem("contador",totalProductos);
    }

    let contadorCarrito = document.getElementById('contador-carrito');

    contadorCarrito.innerText = totalProductos;
}

function guardarCarritoLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito));
    updateContador()
}

function cargarCarritoLocalStorage(){
    const carritoStorage = localStorage.getItem("carrito");
    (carritoStorage) ? carrito.push(...JSON.parse(carritoStorage)) : [] //if ternario   
    updateContador();
}


