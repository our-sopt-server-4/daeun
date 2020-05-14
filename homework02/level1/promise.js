let isMomHappy = true;
let phone = {
    brand : 'Samsung',
    color : 'black'
}

var willGetNewPhone = new Promise((resolve,reject)=>{
    if(isMomHappy) resolve(console.log(phone));
    else reject(Error('mom is not happy'));
})