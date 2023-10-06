# The Sketchbook

I think the usual ```npm install``` and ```npm start``` should give you a somewhat functional frontend. You still need to link it to the server and ImgBB: 
1. To link this to the backend, you need to make a few edits to the ```Editor.js``` file in the src folder. Specifically, replace all instances of ```http://<app-name>.azurewebsites.net``` with the link to your server.
2. For the image upload to be functional, you need to create an account on ImgBB:
  1. Sign up at ImgBB
  2. Navigate to ```https://api.imgbb.com/``` to get your API key.

