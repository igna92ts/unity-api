"use strict";
var Male = (function () {
    function Male(name, height, weight) {
        this.name = name;
        this.height = height;
        this.weight = weight;
    }
    Male.prototype.makeSound = function () {
        console.log("manly sound");
    };
    Male.prototype.eat = function () {
        console.log(this.name + " is eating");
    };
    Male.prototype.run = function () {
        console.log(this.name + " is running");
    };
    Male.prototype.die = function () {
        console.log(this.name + " just died");
    };
    return Male;
}());
module.exports = Male;
//# sourceMappingURL=Male.js.map