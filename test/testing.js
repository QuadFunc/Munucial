var jsonfile = require('jsonfile')
 
var file = './test.json'
var data = jsonfile.readFileSync(file);
console.log(data);
var name="title";
var content="hello guys";
data.post[name] = content;
 
// jsonfile.writeFileSync(file, tmd, {spaces: 4});