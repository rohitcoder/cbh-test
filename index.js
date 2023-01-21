const {deterministicPartitionKey} = require("./dpk");

console.log("Without Event Data: "+deterministicPartitionKey({"fdsf":"Fsd"}));
console.log("With partitionKey Data :"+deterministicPartitionKey({partitionKey: "1234567890"}));
console.log("With Very long Event Data: "+deterministicPartitionKey({test: "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"}));