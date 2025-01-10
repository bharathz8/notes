"use strict";
function User(user1, user2) {
    return user1.age + user2.age;
}
const age = User({ name: "bharath", age: 20 }, { name: "rahul", age: 20 });
console.log(age);
