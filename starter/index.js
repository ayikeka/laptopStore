const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 1337;
const hostname = '127.0.0.1';

const json = fs.readFileSync(`${__dirname}/data/data.json`, `utf-8`);
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // Products OVerview
    if(pathName === '/products' || pathName === '/'){
        res.statusCode = 200;
        res.writeHead(200, {'Content-type' : 'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            if(!err && data){
                fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                    if(!err && data){
                        const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                        overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                        res.end(overviewOutput);
                    }
                });
            }
           
        });

    // laptop overview
    }else if(pathName === '/laptop' && id < laptopData.length){
    
        res.writeHead(200, {'Content-type' : 'text/html'});
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            if(!err && data){
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
            }else{
                res.end('There is an error reading the file');
            }
            
        });
    // Images
    }else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            if(!err && data){
                res.writeHead(200, {'Content-type' : 'image/jpg'});
                res.end(data);
            }
        });
    }
    else{
        res.writeHead(200, {'Content-type' : 'text/html'});
        res.end(`URL was not found on the server`);
    }

    
});

server.listen(port, hostname, ()=>{
    console.log('Listening for requests now on ' + hostname + ' : ' + port);
});

// Cards layout
function replaceTemplate(originalHtml, laptop){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
                output = output.replace(/{%IMAGE%}/g, laptop.image);
                output = output.replace(/{%PRICE%/g, laptop.price);
                output = output.replace(/{%SCREEN%}/g, laptop.screen);
                output = output.replace(/{%CPU%}/g, laptop.cpu);
                output = output.replace(/{%STORAGE%/g, laptop.storage);
                output = output.replace(/{%RAM%}/g, laptop.ram);
                output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
                output = output.replace(/{%ID%}/g, laptop.id);
                return output;
    }