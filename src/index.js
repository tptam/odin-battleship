const content = document.querySelector("#content");
const title = document.createElement("h1");
const para = document.createElement("p");
title.textContent = "Hello world!";
para.textContent = "This is a sample page created as a template.";

content.appendChild(title);
content.appendChild(para);
