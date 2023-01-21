![](https://worldcup.marufdev.me/logo.svg)

## Overview

For our culminating project, we've created a demo booking system application based around the 2026 World Cup. The program consists of two parts, a website (frontend), and an API server (backend). The frontend handles interactions with the user in a graphical context, while the backend handles logic behind the scenes, such as providing the frontend with data from a database (user purchased tickets, game data).

To accomplish this, we made use of TypeScript (a superset of JavaScript) in combination with React, a JavaScript library for creating user interfaces on websites and apps. The reason we opted to use TypeScript over regular JavaScript is because it provides static typings to the language, which makes it even more similar in syntax to Java than it already was. 

## Concepts Implemented

In this project, we made sure to use concepts from everything we've learned in this course, including file reading/writing, arrays, classes/objects, iteration, sorting algorithms, searching algorithms, and recursion.

### File Reading/Writing

File reading and writing is used in the backend of this project. The [`games.txt`](src/backend/games.txt) stores a dataset of world cup games to be played and related data that is used by the website. In order to parse this data into an array of objects we make use of Node.js's Filesystem API to read the file in [`src/backend/src/util/util.ts`](src/backend/src/util/util.ts#L42). The raw string data of the file is then parsed into an array of objects using a Regular Expression.

File writing is used in the contact page logic handled by the backend. On the website, there is a contact page where the user can write and submit a message. This message is sent to the API through an HTTP request, and the data is written to a message.txt file. Our implementation of this file writing can be seen in [`src/backend/src/routes/contact.ts`](src/backend/src/routes/contact.ts).

### Arrays

JavaScript does not have a separate ArrayList class like Java does. However, its Array class is very similar in usage to ArrayLists in Java, with methods like `.push()` and `.slice()` being used to add and remove elements from arrays. Arrays are used throughout the frontend and backend of the application, such as storing datasets of objects like tickets and individual game data. One of it's central uses is for generating the field map for each game in the frontend, where a nested array is used to represent the field. The top level of the array represents each row of seats, while the inner sublevel of each array represents the individual seat in each row. This implementation can be seen in the generateSeats() function in [`src/frontend/src/util/util.ts`](src/frontend/src/util/util.ts#L196).

### Iteration

When handling arrays, iteration is often used. We iterate through arrays at various points in both the frontend and backend. The primary loop used in our application are `for...of` loops, which are the same thing as Enhanced For Loops in Java. An example of nested for loops can be seen in the aforementioned [`src/frontend/src/util/util.ts`](src/frontend/src/util/util.ts#L185). file, with a regular for loop nested inside an enhanced for loop. A use of while loops can also be found in the same file, for the `binarySearch()` function.

### Classes/Objects

Classes are primarily used in the backend part of the application. After the data from `games.txt` is parsed, individual Country and Game classes are created for each entry in the data. We use the toJSON method in each class to transform them into JSON compatible objects, so that they can be sent by the API to the website over an HTTP request. The class implementations can be seen in [`src/backendend/src/util/structures.ts`](src/backend/src/util/structures.ts).

Additionally, each API route in the [`src/backend/src/routes`](src/backend/src/routes) is its own class. Each of these classes can have their own `get()`, `post()`, `put()`, and `delete()` methods, which correspond to the different types of basic HTTP requests used by the application.

### Searching Algorithms

In the Book Tickets page of the website, the user is prompted to pick a location. Once the user chooses, the application needs to find the corresponding object with the dataset for the chosen location, which requires searching for it from an array sent from the API. For this task, the searching algorithm we've opted to use is Binary Search, as it is faster than the Linear Search algorithm. This implementation of Binary Search is done through iteration, using a while loop rather than recursion. Our implementation of Binary Search can be seen in [`src/frontend/src/util/util.ts`](src/frontend/src/util/util.ts#L79)

### Sorting & Recursion Algorithms

In order to use the Binary Search algorithm on an array, the array must already be sorted. In order to accomplish this, the sorting algorithm we made use of in this application is Quick Sort, a "divide and conquer" algorithm that works by picking an element as a pivot, and partioning the array to be searched around this pivot. Our implementation of Quick Sort can be seen in [`src/frontend/src/util/util.ts`](src/frontend/src/util/util.ts#L104), where the main `quickSort()`, `partition()`, and `swap()` functions are defined. It makes use of exponential recursion, where each partition is recursively partitioned until the array is sorted.

One key difference in our implementation is that we are sorting an array of objects, rather than numerical values. In this case, we compare and sort the elements in the array by the `city` property of each object, as that is used to identify each game throughout the program (the `id` property in the object is just the `city` property with the spaces replaced with dashes).

### Other
We've used various other concepts in addition to the aforementioned ones, such as switch/case decisional structures, try/catch blocks, reading a directory of files to retrieve each file name, etc. All in all, this project has helped strengthen our understanding of concepts learned during this semester, as well as providing us with an opportunity to learn additional concepts not covered in the course.

## Image Credits
Credits for images used in our project:

- [Soccer background pattern](https://www.vecteezy.com/vector-art/464389-seamless-pattern-soccer-theme-for-use-as-background)
- [Soccer ball image](https://cdn-icons-png.flaticon.com/512/53/53283.png)
- [Icon](https://www.emirates247.com/polopoly_fs/1.695931.1671728119!/image/image.jpg)
