const nameSpaceWrapper = require('./namespaceWrapper');

let run = async () => {

    let state = await nameSpaceWrapper.getstate("HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP")

    console.log(state)  
     
}

run();