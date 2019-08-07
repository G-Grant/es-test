import { observable } from 'mobx';

class Animal{
    @observable name = '张三'
}

console.log(
    new Animal().name
)
