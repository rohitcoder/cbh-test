# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

I made the following changes to the function:

1. I removed the unnecessary candidate variable and replaced it with partitionKey
2. I used the ternary operator to simplify the logic for setting the partitionKey
3. I reduced multiple if statements into two, which made the code more readable and easy to understand. One ``if`` block is responsible if something wrong with event data (Data without Partitionkey or with partitionkey) another ``if`` block is responsible to check if partitionKey is too long then hash it
4. I added a default return value of "0" for the case when event is null, this is useful so that function does not throw an error
5. Code is more fast because it returns values as soon as possible instead of processing other blocks of code which isn't required

My version of the code is more readable because it uses fewer variables and fewer if statements, making it easier to understand what the function does and how it does it. The added comments also help to explain the code and newly added 5 unit tests ensure that the refactored code still works as expected.