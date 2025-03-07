function suma(numero_uno, numero_dos) {
    return new Promise((resolve) => {
    setTimeout(() => {
    let resultado = numero_uno + numero_dos;
    resolve(resultado);
    }, 1000);
    });
    }
    async function ejecutarSuma() {
    let resultado = await suma(2, 5);
    console.log(resultado);
    //que pasaría con el hola mundo aquí?
    }
    ejecutarSuma();
    console.log("Hola mundo");