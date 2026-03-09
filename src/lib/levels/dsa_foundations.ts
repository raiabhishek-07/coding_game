import { LevelConfig } from './types';

export const DSA_STRINGS: LevelConfig[] = [
    {
        id: 'dsa-1', world: 10, level: 1, title: 'Reverse a String', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The ancient runes are written backwards. To unlock the temple, you must flip the incantation!',
        objective: 'Write a function reverseString(s) that returns the reversed string.',
        starterCode: `function reverseString(s) {
  // Your code here
}

console.log(reverseString("hello")); // "olleh"`,
        hints: ['💡 In JS, you can use s.split("").reverse().join("")', '💡 Or use a for loop starting from the end of the string.'],
        validate: (logs: string[]) => logs.includes('olleh'),
        winMessage: 'The runes flip and glow! The door unseals.',
        xpReward: 100, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-2', world: 10, level: 2, title: 'Palindrome Check', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'A magic mirror only allows entry if you present a word that looks the same from both sides.',
        objective: 'Write a function isPalindrome(s) that returns true if the string is a palindrome.',
        starterCode: `function isPalindrome(s) {
  // Your code here
}

console.log(isPalindrome("madam")); // true
console.log(isPalindrome("knight")); // false`,
        hints: ['💡 A palindrome is equal to its reverse.', '💡 s === s.split("").reverse().join("")'],
        validate: (logs: string[]) => logs.includes('true') && logs.includes('false'),
        winMessage: 'The mirror reflects your progress! Path cleared.',
        xpReward: 100, gemReward: 2, warriorAnimation: 'celebrate', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-3', world: 10, level: 3, title: 'Count Vowels', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The singing birds need more breath! Count every vowel (a, e, i, o, u) in their song.',
        objective: 'Write a function countVowels(s) that returns the number of vowels in the string.',
        starterCode: `function countVowels(s) {
  // Your code here
}

console.log(countVowels("programming")); // 3`,
        hints: ['💡 Use a string of vowels "aeiou" and check character presence.', '💡 Don\'t forget to handle case sensitivity!'],
        validate: (logs: string[]) => logs.includes('3') || logs.some(l => l.includes('3')),
        winMessage: 'The melody reaches a high note! Success.',
        xpReward: 100, gemReward: 2, warriorAnimation: 'collect', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-4', world: 10, level: 4, title: 'Anagram Check', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'Two scrolls contain the same letters but in different orders. Are they secret twins?',
        objective: 'Write a function isAnagram(s1, s2) that returns true if s1 and s2 are anagrams.',
        starterCode: `function isAnagram(s1, s2) {
  // Your code here
}

console.log(isAnagram("listen", "silent")); // true`,
        hints: ['💡 Sort both strings and compare them.', '💡 s1.split("").sort().join("") === s2.split("").sort().join("")'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'The scrolls align perfectly. You found the connection!',
        xpReward: 120, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-5', world: 10, level: 5, title: 'Frequency Count', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The alchemist needs a precise count of every ingredient in the formula.',
        objective: 'Write a function charFreq(s) that returns an object with character counts.',
        starterCode: `function charFreq(s) {
  // Your code here
}

console.log(charFreq("apple")); // { a: 1, p: 2, l: 1, e: 1 }`,
        hints: ['💡 Use a loop and an object to store counts.', '💡 obj[char] = (obj[char] || 0) + 1'],
        validate: (logs: string[]) => logs.some(l => l.includes('p: 2') || l.includes('"p": 2')),
        winMessage: 'The formula is balanced! The potion bubbles.',
        xpReward: 150, gemReward: 3, warriorAnimation: 'collect', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-6', world: 10, level: 6, title: 'First Unique Char', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'Amidst the echoes, only one voice speaks once. Find the first character that does not repeat.',
        objective: 'Return the first non-repeating character in the string.',
        starterCode: `function firstUnique(s) {
  // Your code here
}

console.log(firstUnique("leetcode")); // "l"`,
        hints: ['💡 Count all characters first.', '💡 Loop through the string again to find the first char with count 1.'],
        validate: (logs: string[]) => logs.includes('l'),
        winMessage: 'You found the unique echo!',
        xpReward: 150, gemReward: 3, warriorAnimation: 'celebrate', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-7', world: 10, level: 7, title: 'URLify', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The web bridge is broken! Replace all spaces with "%20" to fix the path.',
        objective: 'Replace every space (" ") in a string with "%20".',
        starterCode: `function urlify(s) {
  // Your code here
}

console.log(urlify("Mr John Smith")); // "Mr%20John%20Smith"`,
        hints: ['💡 Use s.replaceAll(" ", "%20") or a split/join trick.'],
        validate: (logs: string[]) => logs.includes("Mr%20John%20Smith"),
        winMessage: 'The bridge is patched! You cross safely.',
        xpReward: 120, gemReward: 2, warriorAnimation: 'walk', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-8', world: 10, level: 8, title: 'String Compression', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The data crystals are too heavy. Compress them into a shorter sequence!',
        objective: 'Return compressed string like "a2b1c5a3". If not shorter, return original.',
        starterCode: `function compress(s) {
  // Your code here
}

console.log(compress("aabcccccaaa")); // "a2b1c5a3"`,
        hints: ['💡 Iterate and count consecutive characters.', '💡 Compare lengths at the end.'],
        validate: (logs: string[]) => logs.includes('a2b1c5a3'),
        winMessage: 'Data condensed! The crystals are light now.',
        xpReward: 180, gemReward: 3, warriorAnimation: 'collect', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-9', world: 10, level: 9, title: 'String Rotation', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'The stone circle has shifted. Is "erbottlewat" just "waterbottle" rotated?',
        objective: 'Check if s2 is a rotation of s1.',
        starterCode: `function isRotation(s1, s2) {
  // Your code here
}

console.log(isRotation("waterbottle", "erbottlewat")); // true`,
        hints: ['💡 Check if s2 is a substring of s1 + s1.'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'The stones click into place! The rotation is verified.',
        xpReward: 180, gemReward: 3, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-10', world: 10, level: 10, title: 'Valid Parentheses', worldName: 'DSA Foundation', concept: 'DSA Strings',
        story: 'Every opening portal must have a closing seal. Ensure all brackets are balanced.',
        objective: 'Check if parenthesis string "()[]{}" is valid.',
        starterCode: `function isValid(s) {
  // Your code here
}

console.log(isValid("()[]{}")); // true
console.log(isValid("([)]"));   // false`,
        hints: ['💡 Use a Stack data structure (array).', '💡 Map opening to closing: { "(" : ")" }'],
        validate: (logs: string[]) => logs.includes('true') && logs.includes('false'),
        winMessage: 'The portals are stable. Safety secured!',
        xpReward: 200, gemReward: 5, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    }
];

export const DSA_ARRAYS: LevelConfig[] = [
    {
        id: 'dsa-11', world: 11, level: 1, title: 'Find Max Min & Largest', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'The mountain range is jagged. Scout the highest peak (largest element).',
        objective: 'Write a function findLargest(arr) that returns the largest element in the array.',
        starterCode: `function findLargest(arr) {
  // Your code here
}

console.log(findLargest([3, 7, 2, 9, 4])); // 9`,
        hints: ['💡 Keep track of max_val starting from arr[0], and iterate.', '💡 Or use Math.max(...arr)'],
        validate: (logs: string[]) => logs.includes('9'),
        winMessage: 'Geography mapped! Terrain understood.',
        xpReward: 100, gemReward: 2, warriorAnimation: 'walk', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-12', world: 11, level: 2, title: 'Second Largest', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'The champion is crowned, but who is the runner-up in this army of numbers?',
        objective: 'Find the second largest unique number in the array.',
        starterCode: `function secondLargest(arr) {
  // Your code here
}

console.log(secondLargest([10, 20, 4, 45, 99])); // 45`,
        hints: ['💡 Use a Set to remove duplicates, then sort.', '💡 Or keep track of max and secondMax in one loop.'],
        validate: (logs: string[]) => logs.includes('45'),
        winMessage: 'The runner-up is identified. Honor to both!',
        xpReward: 120, gemReward: 2, warriorAnimation: 'celebrate', worldTheme: 'village', enemies: []
    },
    {
        id: 'dsa-13', world: 11, level: 3, title: 'Remove Duplicates', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'The barracks are overcrowded with clones. Keep only one of each unique warrior.',
        objective: 'Return a new array with duplicate numbers removed.',
        starterCode: `function removeDuplicates(arr) {
  // Your code here
}

console.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]`,
        hints: ['💡 [ ...new Set(arr) ] is the modern JS way.', '💡 Or use .filter()'],
        validate: (logs: string[]) => logs.some(l => l.includes('1, 2, 3, 4') || l.includes('1,2,3,4')),
        winMessage: 'The barracks are orderly now!',
        xpReward: 130, gemReward: 3, warriorAnimation: 'collect', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-14', world: 11, level: 4, title: 'Missing Number', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'One of the golden keys is gone! The set should be 1 to N. Which one is missing?',
        objective: 'Find the missing number in an array containing N-1 elements from 1 to N.',
        starterCode: `function missingNumber(arr, n) {
  // Your code here
}

console.log(missingNumber([1, 2, 3, 5], 5)); // 4`,
        hints: ['💡 Arithmetic sum formula: n * (n + 1) / 2', '💡 Subract actual sum from expected sum.'],
        validate: (logs: string[]) => logs.includes('4'),
        winMessage: 'Key found! The chest clicks open.',
        xpReward: 140, gemReward: 2, warriorAnimation: 'collect', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-15', world: 11, level: 5, title: 'Sum of Elements', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'Calculate the total power of all warriors in the brigade.',
        objective: 'Find the sum of all elements in the array.',
        starterCode: `function arraySum(arr) {
  // Your code here
}

console.log(arraySum([1, 2, 3, 4])); // 10`,
        hints: ['💡 Use a loop to add each element to a total.', '💡 Or use arr.reduce((a, b) => a + b)'],
        validate: (logs: string[]) => logs.includes('10'),
        winMessage: 'Brigade power calculated!',
        xpReward: 100, gemReward: 2, warriorAnimation: 'fight', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-16', world: 11, level: 6, title: 'Rotate Array', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'The circular shield needs to spin. Rotate the array to the right by K steps.',
        objective: 'Rotate array right by K.',
        starterCode: `function rotate(arr, k) {
  // Your code here
}

console.log(rotate([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]`,
        hints: ['💡 k = k % length to handle large rotations.', '💡 Use slice() and concat().'],
        validate: (logs: string[]) => logs.some(l => l.includes('4, 5, 1, 2, 3') || l.includes('4,5,1,2,3')),
        winMessage: 'The shield is spinning perfectly!',
        xpReward: 160, gemReward: 3, warriorAnimation: 'magic', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-17', world: 11, level: 7, title: 'Two Sum', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'Find the two magical stones whose power adds up to the gate\'s seal.',
        objective: 'Return indices of the two numbers that add up to target.',
        starterCode: `function twoSum(arr, target) {
  // Your code here
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
        hints: ['💡 Use a Map for O(n) or nested loops for O(n²).'],
        validate: (logs: string[]) => logs.some(l => l.includes('0') && l.includes('1')),
        winMessage: 'The sum is correct! The gate glows.',
        xpReward: 180, gemReward: 4, warriorAnimation: 'magic', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-18', world: 11, level: 8, title: 'Majority Element', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'In the council of numbers, one leader appears more than half the time.',
        objective: 'Find the element that appears > n/2 times.',
        starterCode: `function majority(arr) {
  // Your code here
}

console.log(majority([3, 2, 3])); // 3`,
        hints: ['💡 Boyer-Moore Voting Algorithm or a frequency object.'],
        validate: (logs: string[]) => logs.includes('3'),
        winMessage: 'The leader is chosen!',
        xpReward: 170, gemReward: 3, warriorAnimation: 'celebrate', worldTheme: 'village', enemies: []
    },
    {
        id: 'dsa-19', world: 11, level: 9, title: 'Array Product', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'Calculate the combined power of every other unit in the division.',
        objective: 'Return array where out[i] is product of all elements except arr[i]. No division allowed.',
        starterCode: `function productExceptSelf(arr) {
  // Your code here
}

console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
        hints: ['💡 Prefix and Suffix products are the key.'],
        validate: (logs: string[]) => logs.some(l => l.includes('24, 12, 8, 6') || l.includes('24,12,8,6')),
        winMessage: 'Synergy calculated! Power maximized.',
        xpReward: 200, gemReward: 5, warriorAnimation: 'magic', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-20', world: 11, level: 10, title: 'Kadane\'s Alg', worldName: 'DSA Foundation', concept: 'DSA Arrays',
        story: 'Find the highest sustained power streak in the fluctuating energy field.',
        objective: 'Find maximum sum subarray.',
        starterCode: `function maxSubArray(arr) {
  // Your code here
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
        hints: ['💡 Kadane\'s Algorithm: currentSum = max(num, currentSum+num)'],
        validate: (logs: string[]) => logs.includes('6'),
        winMessage: 'The peak power streak is harnessed!',
        xpReward: 250, gemReward: 5, warriorAnimation: 'magic', worldTheme: 'inferno', enemies: []
    }
];

export const DSA_LOGIC: LevelConfig[] = [
    {
        id: 'dsa-21', world: 12, level: 1, title: 'Check Prime', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'The stone of truth only glows for prime numbers. Is this one pure?',
        objective: 'Return true if n is prime.',
        starterCode: `function isPrime(n) {
  // Your code here
}

console.log(isPrime(7));  // true
console.log(isPrime(10)); // false`,
        hints: ['💡 Loop from 2 to sqrt(n). If divisible, return false.'],
        validate: (logs: string[]) => logs.includes('true') && logs.includes('false'),
        winMessage: 'The stone glows bright! Purity verified.',
        xpReward: 100, gemReward: 2, warriorAnimation: 'celebrate', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-22', world: 12, level: 2, title: 'Fibonacci', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'The golden spiral grows. Predict the N-th number in the sequence.',
        objective: 'Return N-th Fibonacci number (0, 1, 1, 2, 3, 5, 8...).',
        starterCode: `function fib(n) {
  // Your code here
}

console.log(fib(5)); // 5 (0, 1, 1, 2, 3, 5)`,
        hints: ['💡 Iterative or recursive. Recursion is slower without memoization.'],
        validate: (logs: string[]) => logs.includes('5'),
        winMessage: 'The spiral continues. Future predicted!',
        xpReward: 120, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-23', world: 12, level: 3, title: 'Factorial', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'The factorial tower reaches the sky. How many ways to stack N blocks?',
        objective: 'Return N! (n * n-1 * ... * 1).',
        starterCode: `function factorial(n) {
  // Your code here
}

console.log(factorial(5)); // 120`,
        hints: ['💡 Use a loop or recursion.'],
        validate: (logs: string[]) => logs.includes('120'),
        winMessage: 'The tower is tall and strong!',
        xpReward: 100, gemReward: 1, warriorAnimation: 'collect', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-24', world: 12, level: 4, title: 'GCD', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'Find the greatest common factor between two kingdoms.',
        objective: 'Find Greatest Common Divisor of a and b.',
        starterCode: `function gcd(a, b) {
  // Your code here
}

console.log(gcd(48, 18)); // 6`,
        hints: ['💡 Use Euclidean algorithm: gcd(a, b) = gcd(b, a % b)'],
        validate: (logs: string[]) => logs.includes('6'),
        winMessage: 'Common ground reached!',
        xpReward: 130, gemReward: 2, warriorAnimation: 'walk', worldTheme: 'village', enemies: []
    },
    {
        id: 'dsa-25', world: 12, level: 5, title: 'Armstrong Number', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'A number is "Strong" if the sum of its digits raised to count equals itself.',
        objective: 'Check if N is an Armstrong number.',
        starterCode: `function isArmstrong(n) {
  // Your code here
}

console.log(isArmstrong(153)); // true (1^3 + 5^3 + 3^3 = 153)`,
        hints: ['💡 Split digits, find power, sum them up.'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'A strong number for a strong warrior!',
        xpReward: 150, gemReward: 3, warriorAnimation: 'celebrate', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-26', world: 12, level: 6, title: 'Decimal to Binary', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'The machines only speak in zeros and ones. Translate the code!',
        objective: 'Convert decimal N to binary string.',
        starterCode: `function toBinary(n) {
  // Your code here
}

console.log(toBinary(10)); // "1010"`,
        hints: ['💡 Use n.toString(2) or repeated division by 2.'],
        validate: (logs: string[]) => logs.includes('1010'),
        winMessage: 'Translation complete. Machines online.',
        xpReward: 120, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-27', world: 12, level: 7, title: 'Count Set Bits', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'How many sparks of energy (1s) are in the machine\'s message?',
        objective: 'Count number of set bits in binary N.',
        starterCode: `function countSetBits(n) {
  // Your code here
}

console.log(countSetBits(10)); // 2 (1010 has two 1s)`,
        hints: ['💡 Use bitwise & with (n-1) or n.toString(2) + regex.'],
        validate: (logs: string[]) => logs.includes('2'),
        winMessage: 'Energy levels measured!',
        xpReward: 150, gemReward: 3, warriorAnimation: 'collect', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-28', world: 12, level: 8, title: 'Swap Without Temp', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'Swap the contents of two magic jars without using a third one.',
        objective: 'Swap a and b without a helper variable. Log "a=X, b=Y".',
        starterCode: `let a = 5, b = 10;
// Swap them here

console.log(\`a=\${a}, b=\${b}\`); // "a=10, b=5"`,
        hints: ['💡 Use addition/subtraction or [a, b] = [b, a]'],
        validate: (logs: string[]) => logs.some(l => l.includes('a=10') && l.includes('b=5')),
        winMessage: 'Efficiency mastered! Jars swapped.',
        xpReward: 100, gemReward: 1, warriorAnimation: 'magic', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-29', world: 12, level: 9, title: 'Power of Two', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'Does the energy pulse at a perfect doubling frequency?',
        objective: 'Check if N is a power of 2.',
        starterCode: `function isPowerOfTwo(n) {
  // Your code here
}

console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(18)); // false`,
        hints: ['💡 n > 0 && (n & (n - 1)) === 0'],
        validate: (logs: string[]) => logs.includes('true') && logs.includes('false'),
        winMessage: 'Frequency aligned!',
        xpReward: 150, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-30', world: 12, level: 10, title: 'Perfect Number', worldName: 'DSA Foundation', concept: 'DSA Logic',
        story: 'A perfect number equals the sum of its divisors. Is this destiny?',
        objective: 'Check if N is perfect.',
        starterCode: `function isPerfect(n) {
  // Your code here
}

console.log(isPerfect(28)); // true (1+2+4+7+14 = 28)`,
        hints: ['💡 Sum all divisors from 1 up to n/2.'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'Absolute perfection!',
        xpReward: 200, gemReward: 5, warriorAnimation: 'celebrate', worldTheme: 'tower', enemies: []
    }
];

export const DSA_LISTS: LevelConfig[] = [
    {
        id: 'dsa-31', world: 13, level: 1, title: 'LL Nodes', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'A linked list is a chain. Create the first link in the armor.',
        objective: 'Create a Node object with "val" and "next" properties.',
        starterCode: `function createNode(val) {
  // Return an object { val, next: null }
}

let node = createNode(10);
console.log(node.val);   // 10
console.log(node.next);  // null`,
        hints: ['💡 Linked Lists in JS are just objects with pointers.'],
        validate: (logs: string[]) => logs.includes('10') && logs.includes('null'),
        winMessage: 'The first link is forged!',
        xpReward: 80, gemReward: 1, warriorAnimation: 'collect', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-32', world: 13, level: 2, title: 'LL Reversal', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The chain is pulling the wrong way. Reverse the links!',
        objective: 'Reverse a Linked List head and return new head.',
        starterCode: `// LL is { val, next }
function reverseLL(head) {
  // Your code here
}

let list = { val: 1, next: { val: 2, next: null }};
let rev = reverseLL(list);
console.log(rev.val);      // 2
console.log(rev.next.val); // 1`,
        hints: ['💡 Use three pointers: prev, current, next.'],
        validate: (logs: string[]) => logs.includes('2') && logs.includes('1'),
        winMessage: 'Direction reversed! The chain holds.',
        xpReward: 200, gemReward: 5, warriorAnimation: 'magic', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-33', world: 13, level: 3, title: 'Find Middle', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'Where is the weak point? Find the exact middle node of the chain.',
        objective: 'Return middle node of LL. (Use slow/fast pointers).',
        starterCode: `function findMiddle(head) {
  // Your code here
}

let list = { val: 1, next: { val: 2, next: { val: 3, next: null }}};
console.log(findMiddle(list).val); // 2`,
        hints: ['💡 Move slow pointer by 1, fast pointer by 2.'],
        validate: (logs: string[]) => logs.includes('2'),
        winMessage: 'Weak point found! Tactical advantage.',
        xpReward: 150, gemReward: 3, warriorAnimation: 'walk', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-34', world: 13, level: 4, title: 'Detect Loop', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The chain is infinite! Detect if it loops back on itself.',
        objective: 'Return true if LL has a cycle.',
        starterCode: `function hasCycle(head) {
  // Your code here
}

let node1 = { val: 1 };
let node2 = { val: 2 };
node1.next = node2;
node2.next = node1; // cycle!
console.log(hasCycle(node1)); // true`,
        hints: ['💡 Floyd\'s tortoise and hare algorithm.'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'Loop detected! The paradox is broken.',
        xpReward: 200, gemReward: 4, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    },
    {
        id: 'dsa-35', world: 13, level: 5, title: 'Merge Sorted', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'Two companies of soldiers must merge into one single sorted line.',
        objective: 'Merge two sorted LLs.',
        starterCode: `function merge(l1, l2) {
  // Your code here
}

let l1 = { val: 1, next: { val: 3, next: null }};
let l2 = { val: 2, next: null };
let merged = merge(l1, l2);
console.log(merged.val, merged.next.val, merged.next.next.val); // 1 2 3`,
        hints: ['💡 Use a dummy head node to build the new list.'],
        validate: (logs: string[]) => logs.some(l => l.includes('1') && l.includes('2') && l.includes('3')),
        winMessage: 'Armies combined! Unity prevails.',
        xpReward: 180, gemReward: 3, warriorAnimation: 'celebrate', worldTheme: 'village', enemies: []
    },
    {
        id: 'dsa-36', world: 13, level: 6, title: 'Delete N-th', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The N-th commander from the back is a spy. Remove him!',
        objective: 'Remove N-th node from end of LL.',
        starterCode: `function removeNthFromEnd(head, n) {
  // Your code here
}

let list = { val: 1, next: { val: 2, next: { val: 3, next: null }}};
let result = removeNthFromEnd(list, 1); // removes 3
console.log(result.next.next); // null`,
        hints: ['💡 Use two pointers with a gap of N.'],
        validate: (logs: string[]) => logs.includes('null'),
        winMessage: 'Spy removed! Security restored.',
        xpReward: 180, gemReward: 3, warriorAnimation: 'fight', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-37', world: 13, level: 7, title: 'LL Palindrome', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The chain is magical — it reads the same from front to back.',
        objective: 'Check if LL is a palindrome.',
        starterCode: `function isLLPalindrome(head) {
  // Your code here
}

let list = { val: 1, next: { val: 2, next: { val: 1, next: null }}};
console.log(isLLPalindrome(list)); // true`,
        hints: ['💡 Find middle, reverse second half, compare.'],
        validate: (logs: string[]) => logs.includes('true'),
        winMessage: 'Symmetry confirmed!',
        xpReward: 200, gemReward: 4, warriorAnimation: 'magic', worldTheme: 'tower', enemies: []
    },
    {
        id: 'dsa-38', world: 13, level: 8, title: 'Intersection', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'Two paths merge into one. Where do they meet?',
        objective: 'Return node where two LLs intersect.',
        starterCode: `function getIntersection(headA, headB) {
  // Your code here
}

let common = { val: 3, next: null };
let lA = { val: 1, next: common };
let lB = { val: 2, next: common };
console.log(getIntersection(lA, lB).val); // 3`,
        hints: ['💡 Run pointers of both lists. When one hits null, switch to other head.'],
        validate: (logs: string[]) => logs.includes('3'),
        winMessage: 'Intersection found! The path converges.',
        xpReward: 220, gemReward: 4, warriorAnimation: 'walk', worldTheme: 'forest', enemies: []
    },
    {
        id: 'dsa-39', world: 13, level: 9, title: 'Remove LL Dups', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The message has stuttered links. Clean it up!',
        objective: 'Remove duplicates from unsorted LL.',
        starterCode: `function removeDups(head) {
  // Your code here
}

let list = { val: 1, next: { val: 2, next: { val: 1, next: null }}};
let clean = removeDups(list);
console.log(clean.next.next); // null`,
        hints: ['💡 Use a Set to track seen values.'],
        validate: (logs: string[]) => logs.includes('null'),
        winMessage: 'Message cleaned! Clarity achieved.',
        xpReward: 170, gemReward: 3, warriorAnimation: 'collect', worldTheme: 'vault', enemies: []
    },
    {
        id: 'dsa-40', world: 13, level: 10, title: 'Binary to Decimal', worldName: 'DSA Foundation', concept: 'DSA Lists',
        story: 'The bits are linked in a chain. What is their decimal power?',
        objective: 'Convert LL of 0 and 1 to decimal.',
        starterCode: `function llToDecimal(head) {
  // Your code here
}

let list = { val: 1, next: { val: 0, next: { val: 1, next: null }}};
console.log(llToDecimal(list)); // 5 (101)`,
        hints: ['💡 Iteratively: result = result * 2 + val'],
        validate: (logs: string[]) => logs.includes('5'),
        winMessage: 'Bits converted! Power calculated.',
        xpReward: 150, gemReward: 2, warriorAnimation: 'magic', worldTheme: 'shadow', enemies: []
    }
];

export const ALL_DSA_LEVELS = [
    ...DSA_STRINGS,
    ...DSA_ARRAYS,
    ...DSA_LOGIC,
    ...DSA_LISTS
];
