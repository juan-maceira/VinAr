//array de objetos con todos los vinos

const vinos =
[
    {
        "id": 1,
        "nombre": "Finca La Linda",
        "uva": "Malbec",
        "bodega": "Bodega: Luigi Bosca",
        "img": "img/finca.png",
        "precio": 55,
        "cantidad":1
    },

    {
        "id": 2,
        "nombre": "Luigi Bosca",
        "uva": "Malbec",
        "bodega": "Bodega: Luigi Bosca",
        "img": "img/bosca.png",
        "precio": 74,
        "cantidad":1
    },

    {
        "id": 3,
        "nombre": "DV Catena",
        "uva": "Cabernet-Malbec",
        "bodega": "Bodega: Catena Zapata",
        "img": "img/dv.png",
        "precio": 89,
        "cantidad":1
    },

    {
        "id": 4,
        "nombre": "Alamos",
        "uva": "Malbec",
        "bodega": "Bodega: Catena Zapata",
        "img": "img/alamos.png",
        "precio": 63,
        "cantidad":1
    },

    {
        "id": 5,
        "nombre": "Nicasia",
        "uva": "Malbec",
        "bodega": "Bodega: Catena Zapata",
        "img": "img/nicasia.png",
        "precio": 69,
        "cantidad":1
    },

    {
        "id": 6,
        "nombre": "Trumpeter",
        "uva": "Malbec",
        "bodega": "Bodega: La Rural",
        "img": "img/trumpeter.png",
        "precio": 65,
        "cantidad":1
    }
];


document.addEventListener("DOMContentLoaded", ()=>{

    cargarCarritoLocalStorage();
    imprimirCarrito();
    imprimirVinos();
});

//creo un array vacio para ir llenando
const carrito =  []; 

//Creo una funcion para imprimir los productos de mi dase de datos (vinos) en pantalla.
function imprimirVinos() {

    const tienda = document.getElementById('tienda')  //capturo la etiqueta el id del html a donde voy a anidar los productos

    vinos.forEach((v)=> { //recorro el array de vinos para obtener todos los objetos

        let vino = document.createElement('div') // creo un elemento div en un variable llamada vino
        vino.classList.add('col-12') //le agrego varias clases de bootstrap
        vino.classList.add('col-md-4');
        vino.classList.add('mb-5');
        vino.classList.add('d-flex');
        vino.classList.add('justify-content-center');
        
        //al div 'vino' le inserto codigo html con los valores del array vinos entre ${}
        vino.innerHTML = `
        <div class="card text-dark" style="width: 18rem;">
            <img class="card-img-top" src="${v.img}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${v.nombre}</h5>
                <h6 class="card-title">${v.uva}</h6>
                <h6 class="card-title">${v.bodega}</h6>
                <p>${v.precio} R$</p>
                <button class="btn btn-primary" id="${v.id}">Añadir al carrito</button>
            </div>
        </div>
        `
        
        tienda.appendChild(vino); //anido el div vino dentro de la etiqueta tienda de html

        vino.querySelector('button').addEventListener('click', ()=>{ //selecciono la etiqueta button dentro de vino y me pongo a escuchar los clicks en ese boton
            agregar() // contador general
            agregarVinosAlCarrito(v.id); // invoco la function agregarVinosAlCarrito para que cuando escuche el click se ejecute la function
                  
        })
    }) 
}

imprimirVinos(); //invoco a la funcion para que se ejecute

let contador = 0;
let contadorCarrito = document.getElementById('contador-carrito')
function agregar (){
    contador++;
    contadorCarrito.innerText = contador;
    
}

function eliminar (){
    contador--;
    contadorCarrito.innerText = contador;
}



function agregarVinosAlCarrito(id) { // creo una funcion para comenzar a agregar vinos al array carrito. los voy a agregar por medio de su (id)


    let vino = vinos.find(vino => vino.id === id); //creo una nueva variable vino que por el scope no interfiere con la variable vino declarada en la function imprimirVino()
    // aplico metodo de filtrado find para que  me de la primera coincidencia con mi base de datos
    // vino representa cada producto de mi base de datos.
    // obtengo la primera coincidenca de (vino.id) que sean iguales al (id) parametro de la function

    let vinoEnCarrito = carrito.find(vino => vino.id === id);
    // creo otra variable y con find busco la primer coincidencia de (vinos.id) pero no con array carrito y sus respectivo (id).

    if (vinoEnCarrito){ 
        //si hay un vino vino en el carrito encuentra coincidencia y suma cantidad de a uno
        vinoEnCarrito.cantidad++;
        
        Swal.fire({
            title: 'Excelente!',
            text: 'Otra unidad de este vino se agrego correctamente al carrito',
            imageUrl: 'img/carrito3.png',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })

    } else{  // sino encuentra coincidencia queda en 1
        vino.cantidad = 1;

        carrito.push(vino); //agrego vino al carrito
        
        Swal.fire({
            title: 'Excelente!',
            text: 'El vino se agrego correctamente al carrito',
            imageUrl: 'img/carrito3.png',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
    }
    

    imprimirCarrito(); //invoco la function imprimirCarrito para que se ejecute cuando se agrega un producto al carrito
    calcularTotal() //invoco la funcion total para siempre calcular el total segun sume o reste vinos del carrito
    guardarCarritoLocalStorage()
}


function imprimirCarrito (){ //creo la fuction para imprimir los vinos en el carrito de comprar cuando den click al button agregar al carrito.

    const c = document;
    let carritoPag = c.querySelector('#carrito');

    carritoPag.innerHTML = ''; // para limpiar el modal anterior (carrito) en caso de sumar mas productos e imprime la las cantidades de cada vino en una sola card por vino. para no repetir

    carrito.forEach((v, index)=>{  //recibe cada producto (v) como 1er parametro y el index como 2do parametro(posición del objeto dentro del array carrito) 
        
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
            <img class="card-img-top" src="${v.img}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${v.nombre}</h5>
                <h6 class="card-title">${v.uva}</h6>
                <h6 class="card-title">${v.bodega}</h6>
                <p>${v.precio} R$</p>
                <p>Cantidad: ${v.cantidad}</p> 
                <button class="btn btn-danger">Eliminar</button>
            </div>
        </div>
        `

        // escucho el evento click del boton eliminar dentro de vino 
        vino.querySelector('button').addEventListener('click', ()=>{
            
            eliminarVinoDelCarrito(index) //invoco la funcion para que se ejecute simpre que den click al boton eliminar
        })

        carritoPag.appendChild(vino); //para anidar el div vino dentro del carrito en html
    })
    
    
    
}

function eliminarVinoDelCarrito(index) {

    carrito[index].cantidad--;  //accede a la primera posición del array y resta de a uno
    
    Swal.fire({
        title: 'Atención!',
        text: 'Haz eliminado 1 unidad de este vino',
        imageUrl: 'img/carrito3.png',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })

    if (carrito[index].cantidad === 0) { // cuando llegue a 0

        carrito.splice(index,1); // Se borra la card del carrito

        Swal.fire({
            title: 'Atención!',
            text: 'Has eliminado este vino del carrito',
            imageUrl: 'img/carrito3.png',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
    }

    
    imprimirCarrito(); // invoco esta funcion para volver a imprimir el carrito con los cambios en las cantidades
    calcularTotal(); // invoco esta funcion para que reste del total siempre que se eliminen vinos del carrito
    eliminar();
    guardarCarritoLocalStorage()
}

function calcularTotal(){ // creo un funcion para calcular el valor total de vino en el carrito

    let total = 0; // creo una variable acumulador que comienza en 0

    carrito.forEach((v) =>{  //recorro el carrito porducto por producto para cualcular el total

        total += v.precio * v.cantidad; // precio x cantidad
    })

    const totalHtml = document.getElementById('total') //capturo de html la etiqueta con id total

    totalHtml.innerHTML = `<h5>Total R$ ${total}</h5>` //inserto la varible total declarada en la linea 203 dentro de la etiqueta total de html

}

function guardarCarritoLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito));
    localStorage.setItem("contador", JSON.stringify (contador))
}

function cargarCarritoLocalStorage(){
    const carrito = localStorage.getItem("carrito");
    
    if(carrito){
        carrito.push(...JSON.parse(carrito));
    }
}




