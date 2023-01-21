const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let partitionKey = TRIVIAL_PARTITION_KEY;
  // if we have event data, then use it to generate a partition key else just return the trivial partition key
  if (event) {
    // if we have a partition key, then use it, else use the entire event data
    partitionKey = event.partitionKey || JSON.stringify(event);
    if (typeof partitionKey !== "string") {
      partitionKey = JSON.stringify(partitionKey);
    }
    // if the partition key is too long, then hash it
    if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
      partitionKey = crypto.createHash("sha3-512").update(partitionKey).digest("hex");
    }
  }
  return partitionKey;
};
