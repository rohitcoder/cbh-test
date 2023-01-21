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
});
