import { observable } from 'mobx';

class Animal {
    @observable type = '小猫';
}

const animal = new Animal();

console.log(animal)


