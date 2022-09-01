# NodeJsCodeChallenge

#setup:
First run the localhost server using: 
  npm run mongo
  
The code uploaded without the node_modules file to get it go to the project open termianl then write: 
npm install 
 
 Then run the nodeJs code using:
 npm start
 
 
 code:
  .env:
  contain the port number
  
  server folder:
  server.js file, contain the nodemailer which is a Node. js module that allows us to send emails from our server with ease.
  I render it in the signUp controller.
  
 
 Middlewares folder:
 contain:
    - is-auth file: contain a middlewar to decode the token 
 
    - Validation folder:
          conatin a files for validation

config folder:
    - mongo file which contain the connection to the server 
    
then i have the other code: controllers and models 
