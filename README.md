# Team Management API

Team management API that uses a tree data structure to represent the members of a given team. Each member can have subordinates.

## Implementation details

This API is built using **Node.js** + **Express.js**

Other technologies that are part of the application:
- **JWT**: authentication via tokens
- **bcrypt**: basic authentication for receiving the authentication tokens.
- **Jest** and **Supertest**: API testing
- **Morgan**: logging of HTTP requests to the API
- **Winston**: logging of all requests to the API
- **MongoDB**: storing and retrieving planets and launches data
- **Helmet**: adding and configuring some commonly missed server response headers.
- **Dotenv**: managing server secrets
- **Nodemon**: automatically restarts app when files change.
- **Postman**: I have provided a Postman collection that you can use to make request against the API available here: **/src/utils/Team Management API.postman_collection.json**. If you have some issues with the requests, that is probably because you are missing the token, so please add it as part of your headers in the requests to /team endpoints. Its key should be **x-access-token** and value - the token you receive after successful registration and authentication with the registered user.

# Things left to do (time constraint)
- **Error handling & validation**: I have added basic validation for the sake of showcase, but there are more edge cases to test and there is the need for a global error handler to prevent the application from crashing.
- **Tests**: I have laid out the structure for unit tests of the team manager and API tests for /authentication and /team endpoints but they are not complete as I have greatly overstayed my welcome for the deadline of the task. 
- **Extend app for more teams**: Right now, the application has no concept of different teams. It can easily be extended to handle multiple teams.
- **Tree children**: Currently the tree allows for varying team member sizes. Maybe, if we want a cleaner tree, we can set it up via the constructor but in reality teams are usually of varying size.


It's not a good idea to put env variables, these are just for the demo:
```
NODE_ENV = dev
PORT = 8000
JWT_SECRET_KEY = some_mega_super_secret_key
JWT_REQUEST_TOKEN_TEST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiV2VkIEp1biAwMSAyMDIyIDEzOjE1OjQwIEdNVCswMzAwIChFYXN0ZXJuIEV1cm9wZWFuIFN1bW1lciBUaW1lKSIsInVzZXJJZCI6MTIsImlhdCI6MTY1NDA3ODU0MH0.gP2pI3NhRBDVulMSdbKxT9OOOO0P2FAv5vnIfOZjve8";
```

## How to run?

1. Install Node.js
2. Clone project
3. Open console in base folder and do **run npm i**
4. Add your own .env file at the root directory with the settings from above.
5. Run **npm start** or **npm run watch** 

## Notes

- You can either use the JWT token provided above for all requests that are part of the /team routes or create your own tokens via the /authenticate endpoints. Tokens do not currently expire but I have put comments in code on how I'd easily make them expirational, should that be needed.
- To make it easier for you - the data that gets loaded is a flat JSON, so we don't have to do nested structures with members and children. We load a flat data as would be the case of a CSV file for example. There is an endpoint to load the team data (/loadMembers) as well as an endpoint to export it to a well-formatted nested JSON file (/exportMembersData). I have pre-loaded some files with sample data that are located in **/src/utils/data** but you can create your own.
- There is a Postman collection available here: **/src/utils/Team Management API.postman_collection.json** that you can import in JSON and use to run tests against the API.
- I strongly suggest to not use Postman responses when testing my API, but have the console open next to your Postman window and inspect the logs that you get in the console. Why? Because it prints a much more appealing and easy to understand team structure that looks like this:

```
  +-Leanne Graham(Leanne.Graham@april.biz)
    +-Ervin Howell(Ervin.Howell@melissa.tv)
    |  +-Chelsey Dietrich(Chelsey.Dietrich@annie.ca)
    |  +-Dennis Schulist(Dennis.Schulist@jasper.info)
    |  +-Kurtis Weissnat(Kurtis.Weissnat@billy.biz)
    +-Clementine Bauch(Clementine.Bauch@yesenia.net)
    |  +-Nicholas Runolfsdottir V(Nicholas.Runolfsdottir@rosamond.me)       
    |  +-Glenna Reichert(Glenna.Reichert@dana.io)
    |  +-Clementina DuBuque(Clementina.DuBuque@karina.biz)
    +-Patricia Lebsack(Patricia.Lebsack@kory.org)
```
- Thank you for providing me with the task and for the given opportunity.
