const request= require("request")

const handle=async()=>{
  let requestPromise=(url)=>{
    return new Promise((resolve,reject)=>{
      request(url, function (error, response, body) {
        if(error){
          reject(error)
        }
        resolve(body)
      });
    })
  }  
  let response=await requestPromise('http://localhost:8887/testEndpoint')
  console.log(response)
  return fib(10000)
}
const fib = function(n) {
  if (n === 1) {
    return [0, 1];
  } else {
    var arr = fib(n - 1);
    arr.push(arr[arr.length - 1] + arr[arr.length - 2]);
    return arr;
  }
};

global.handle=handle
