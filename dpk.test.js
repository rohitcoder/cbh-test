const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

   // test case for when event is null
   it("returns 0 when event is null", () => {
    expect(deterministicPartitionKey(null)).toEqual("0");
  });

  // test case for when event.partitionKey is a string and less than 256 characters
  it("returns event.partitionKey when it is a string and less than 256 characters", () => {
    expect(deterministicPartitionKey({ partitionKey: "abc" })).toEqual("abc");
  });

  // test case for when event.partitionKey is not present
  it("returns sha3-512 hash of event when partitionKey is not present", () => {
    const event = { a: 1, b: 2 };
    const hash = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    expect(deterministicPartitionKey(event)).toEqual(hash);
  });

  // test case for when event.partitionKey is not a string or more than 256 characters
  it("returns sha3-512 hash of partitionKey when partitionKey is not a string or more than 256 characters", () => {
    const partitionKey = { a: 1, b: 2 };
    const hash = crypto.createHash("sha3-512").update(JSON.stringify(partitionKey)).digest("hex");
    expect(deterministicPartitionKey({ partitionKey })).toEqual(hash);
  });

  it("returns event.partitionKey when it is a string and exactly 256 characters", () => {
    const longPartitionKey = "a".repeat(256);
    expect(deterministicPartitionKey({ partitionKey: longPartitionKey })).toEqual(longPartitionKey);
  });

  it("returns sha3-512 hash of empty object when event is an empty object", () => {
    const event = {};
    const hash = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    expect(deterministicPartitionKey(event)).toEqual(hash);
  });

  it("returns sha3-512 hash of number when event is a number", () => {
    const event = 123;
    const hash = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    expect(deterministicPartitionKey(event)).toEqual(hash);
  });

});
