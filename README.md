Task Manager-REST API
🠚	Task Manager REST API is built on node.js for storing user’s to-do-tasks.
🠚	I've used Express.js library to create web server for task manager application.
🠚	In terms of security JSON Web Token (JWT) is used for generating tokens to implement user authentication and authorization. 
🠚	With the help of multer npm library which allow client to upload images to the server to store the image in the database and to serve it up so that client can access it later on. Allowed user to upload profile picture.
🠚	Used SendGrid email service to setup welcome and cancellation email notification feature from the application.
🠚	MongoDB database used to store user’s and tasks data with mongoose library to access database from Node.js.
🠚	Set up an automated test suite using Jest framework. Automated test for testing authentication, assertions and task data. This helps out tremendously to prevent broken or buggy code specially as my application grows in complexity.
