const fs = require("fs");
const http = require("http");
const url = require("url");

// const about = fs.readFileSync("./html/about.html", "utf-8");
// const home = fs.readFileSync("./html/home.html", "utf-8");
// const contact = fs.readFileSync("./html/contact.html", "utf-8");
// const login = fs.readFileSync("./html/login.html", "utf-8");

// Sync fs
// const inputTxt = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inputTxt);

// const outputTxt = `salom qalay: ${inputTxt}`;
// console.log("yozib boldim");

// fs.writeFileSync("./txt/output.txt", outputTxt);

// Async fs
// fs.readFile("start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("append.txt", "utf-8", (err, data3) => {
//       fs.writeFile("final.txt", `${data2} ${data3} `, "utf-8", (err) => {
//         if (err) throw err;
//         console.log("your code has been saved :D");
//       });
//     });
//   });
// });
// let output = overview.replace("{cardProduct}", card);

let overview = fs.readFileSync("./templates/overview.html", "utf-8");
const product = fs.readFileSync("./templates/product.html", "utf-8");
const card = fs.readFileSync("./templates/card.html", "utf-8");

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const replaceFunc = function (html, obj) {
  let out = html.replace(/{imageProduct}/g, obj.image);
  out = out.replace("{descProduct}", obj.description);
  out = out.replace("{vitaminProduct}", obj.nutrients);
  out = out.replace("{nameProduct}", obj.productName);
  out = out.replace("{detailProduct}", obj.quantity);
  out = out.replace("{priceProduct}", obj.price);
  out = out.replace("{IdProduct}", obj.id);
  out = out.replace("{OrganicProduct}", obj.organic ? "Organic!" : "");
  return out;
};

const server = http.createServer((req, res) => {
  const changeCards = dataObj
    .map((val) => {
      return replaceFunc(card, val);
    })
    .join("");

  overview = overview.replace("{CardProduct}", changeCards);

  let urlcha = req.url;

  console.log(urlcha);

  let query = +url.parse(urlcha, true).query.id;
  if (urlcha === "/overview" || urlcha === "/") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(overview);
  } else if (urlcha.startsWith("/product?id=")) {
    let obj = dataObj.find((val) => {
      return val.id === query;
    });
    let poductObjHTML = replaceFunc(product, obj);
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(poductObjHTML);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1 style='color:red'>Pagen not Found. Pease try again</h1>");
  }
});
server.listen("8000", "127.0.0.1");
