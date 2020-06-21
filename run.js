const main = require('./chef.js');

main.perform(process.argv[2]).then(()=>{process.exit(0)});
