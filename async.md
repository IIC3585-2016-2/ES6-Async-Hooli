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

### References

#### About single-threaded and async execution

[How is javascript asynchronous AND single threaded?](http://www.sohamkamani.com/blog/2016/03/14/wrapping-your-head-around-async-programming/)
[Here there are mentions to promises implementations with event loops, based on an specification](http://stackoverflow.com/questions/23447876/why-do-promise-libraries-use-event-loops)
[Node.js event loop](https://nodesource.com/blog/understanding-the-nodejs-event-loop/)
