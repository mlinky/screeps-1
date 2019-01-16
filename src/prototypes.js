const prototypes = (function(){
    Creep.prototype.sayHello = function() {
        // In prototype functions, 'this' usually has the value of the object calling
        // the function. In this case that is whatever creep you are
        // calling '.sayHello()' on.
        this.say("Hello!");
    };
})();


module.exports = prototypes;