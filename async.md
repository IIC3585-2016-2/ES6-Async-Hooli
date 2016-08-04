# Presentación

### Intro

  Javascript es single thread* y asíncrono. 





### Promesas

```javascript

const promise = new Promise((resolve, reject) => {

  if (/* something */) {
    resolve("asd");
  } else {
    reject();
  }
   
});

promise.then(result => {
  
}).catch(error => {

});

Promise.all([p1, p2, p3]).then([r1, r2, r3] => {

}).catch(error => {

});

promise.then(result => {
  
}).then(result2 => {

}).then(result2 => {

}).catch(error => {

});

promise.then(result => {

}).catch(error => {

}).catch(error => {

});

```

Arrow functions tiene scope de bloque.



### async await
