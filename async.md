# Presentación

### Intro

JavaScript es single thread y asíncrono.

_Everything runs on a different thread except our code._

Las llamadas a operaciones asíncronas, tales como lectura/escritura de archivos o consultas a una base de datos, pueden ser ejecutadas de manera secuencial o en paralelo.

#### Secuencial:

Este es un programa clásico, donde se espera terminar cada instrucción para pasar a la siguiente:

```javascript
const file1 = fs.readFileSync('file1.txt');
console.log(1);

const file2 = fs.readFileSync('file2.txt');
console.log(2);

const file3 = fs.readFileSync('file3.txt');
console.log(3);

/*
 *  Results:
 *  
 *    1
 *    2
 *    3
 */
```

Ahora consideremos la siguiente pieza de código

```javascript
console.log(1);

const file2 = fs.readFileSync('file2.txt');

console.log(3);

console.log(4);

```

Si ejecutar cada línea tarda 10ms, y leer el archivo `file2.txt` demora 20ms, tendremos un total de 60ms. Además, la ejecución se vería como la de la imagen de abajo.

![sync](images/sync.png)

#### Asíncrono:

El primer *snippet*, pero ahora hecho de forma asíncrona:

```javascript
fs.readFile('file1.txt', (err, file) => {
  console.log(1);
});

fs.readFile('file2.txt', (err, file) => {
  console.log(2);
});

fs.readFile('file3.txt', (err, file) => {
  console.log(3);
});

/*
 *  One of the possible results:
 *  
 *    1
 *    3
 *    2
 */
```

Ahora consideremos la siguiente pieza de código, junto con suponer que cada línea demora 10ms y que leer el archivo toma 20ms.

```javascript
console.log(1);

// This line stands for '2'
fs.readFile('file2.txt', (err, file) => {
  console.log(3);
});

console.log(4);

```

El tiempo total que tomará el programa es 50ms. Esto ocurre porque leer el archivo no detiene la ejecución de nuestro programa, mientras que el callback con ```console.log(3)``` se ejecuta una vez que la operación de I/O está concluida.  

![async](images/async.png)

Ahora si suponemos que leer el archivo tarda menos de 10ms, vemos que el programa sólo toma 40ms. Es como si leer el archivo no tuviera costo :smile:.

![async](images/async2.png)

Es necesario notar que aunque el archivo tarde muy poco en leer, el *callback* **nunca** interrumpirá la ejecución de otra pieza de nuestro código. Es por esto que éste se ejecuta de todas maneras al final de nuestro programa. Profundizaremos en este aspecto más adelante.

#### El problema de los *callbacks*

Si necesitamos utilizar el resultado de una operación asíncrona en otra, tarde o temprano nos topamos con el siguiente problema:

```javascript
fs.readFile('file1.txt', (err, file) => {
  if (err) {
    /* :( */
  } else {
    /* Success! */
    fs.readFile('file2.txt', (err, file) => {
      if (err) {
        /* :( */
      } else {
        /* Success! */

        /* And it goes on and on and on and on... */

      })
    }
  }
});
```

### Promesas

Para operaciones asíncronas, JavaScript provee algunas herramientas. Las promesas son objetos que representan un resultado de una operación que no se ha completado, y que se espera que se complete en el futuro.

```javascript
const promise = new Promise((resolve, reject) => {

  /* Something (possibly) asynchronous */

  if (/* Everything goes well */) {
    /* Fulfill */
    resolve(result);
  } else {
    /* Reject */
    reject(error);
  }

});

promise.then(result => {
  /* Executes here if the promise is fulfilled */
}).catch(error => {
  /* Executes here if the promise is rejected */
  /* The exception is caught, but you are free to throw another one */
});
```

Toda promesa está en uno de estos tres estados, mutuamente excluyentes:

- **Fulfilled**: La operación se completó con éxito, y entregó un resultado
- **Rejected**: La operación falló por alguna razón, y entregó un error
- **Pending**: La operación no se ha completado

Una bondad de las promesas es que no importa cuándo se llame a ```then()```. La función se ejecutará de todas maneras si es que el resultado estaba disponible desde antes.

#### Encadenamiento:

Los ```then()``` y ```catch()``` devuelven una nueva promesa, por lo que podemos encadenarlas:
```javascript
promise.then(result1 => {

}).then(result2 => {

}).then(result3 => {

}).catch(error => {

});


promise.then(result1 => {

}).catch(error1 => {

}).then(result2 => {

}).catch(error2 => {

});
```

#### ¿Y si tenemos varias promesas?

```javascript
Promise.all([p1, p2, p3]).then([r1, r2, r3] => {
  /* Executes here when all the promises are fulfilled */
}).catch(error => {
  /* Executes here when any promise is rejected */
});

```

De esta manera podemos realizar lo que queramos una vez que tengamos todos los resultados (si resolvemos todas las promesas por separado, entonces no podríamos usar todos los resultados al mismo tiempo). Si alguna de esas promesas arroja un error, se pasa al `catch`.

### Profundizando en la ejecución single thread y asíncrona

Tal y como dijimos al principio, todo corre en un thread diferente excepto el código que nosotros escribamos.

**Todo el código de los *callbacks*, ```then()``` o ```catch()``` se ejecuta en el mismo thread que el resto de nuestro código. ¿Cómo ocurre esto?**

Una vez que la función del *callback* esté lista para ser ejecutada, se guarda en una cola de espera en un `Job` para que pueda ser ejecutada posteriormente. Esto mismo ocurre cuando una promesa deja de estar pendiente.

Los `Job` en cola se ejecutan una vez que no exista código propio en ejecución. Cuando un `Job` se empieza a ejecutar, se garantiza que ningún otro segmento de código lo interrumpirá. Sin embargo, es posible que el `Job` que se está ejecutando actualmente cree otros `Job`, los que se ejecutarán en algún momento.

#### Consecuencias

- No hay problemas de concurrencia, puesto que existe sólo un thread que hace todo
- Se puede garantizar un orden parcial de las operaciones

Sin embargo, esto también implica que ciertos programas funcionen inesperadamente lento:

```javascript

const start = new Date().getTime();
const wait = 5000;

setTimeout(function(){
  alert('Wait one second')
}, 1000);

while(new Date().getTime() < start + wait);

```

Sin conocer lo señalado anteriormente, esperaríamos que el mensaje de alerta salga en 1 segundo aproximadamente. Lo que ocurre realmente es que el *callback* no se va a ejecutar hasta que se haya terminado de ejecutar nuestro código, que está en [busy waiting](https://en.wikipedia.org/wiki/Busy_waiting) durante 5 segundos.

### ```Async``` / ```await```

Estas *keywords* permitirán trabajar (en el futuro) con promesas de una forma muy parecida al código síncrono.

```javascript

async function getSomething() {
  // Waits until the promise is fulfilled
  const result = await somethingThatReturnsAPromise();
  // Continue here...
}

```

Las excepciones se tratan de la forma clásica

```javascript

async function getSomething() {
  try{
    const result = await somethingThatReturnsAPromise();
    // Continue here...
  } catch (err) {
    console.log(err);
  }
}

```

### References

#### About single-threaded and async execution

- [ECMA2015 spec](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262%206th%20edition%20June%202015.pdf)
- [How is javascript asynchronous AND single threaded?](http://www.sohamkamani.com/blog/2016/03/14/wrapping-your-head-around-async-programming/)
- [Promises libraries are implemented with event loops](http://stackoverflow.com/questions/23447876/why-do-promise-libraries-use-event-loops)
- [Node.js event loop](https://nodesource.com/blog/understanding-the-nodejs-event-loop/)
