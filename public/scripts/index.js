const e = require("express");

alert("hello world");
let userData = {};

document.querySelector("#reg-form").addEventListener("submit", async () => {
  e.preventDefault();
});

const handleRegister = async (e) => {
  userData[`${e.name}`] = e.value;
  console.log(userData);
};

const handleSubmit
