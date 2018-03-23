# performance-matters-server-side

A server-side application. The app is changed to its bare minimum. You can only show a list of all Parks. The full version you can view here:  [Parks of Amsterdam](https://velomovies.github.io/Project-1-WEBDEV/app/#home). 
I removed all javascript in this version and tried to enhence it. 

![Screenshot of the app](img/screenshot.png)

## Enhencement  

With browserify I tried to make an even better and faster javascript file. With the code used below the javascript is bundled automatically. Browserify uses all requires in the main js and bundles them in one file. running `npm run start` starts bundeling the code
```
"browserify": "browserify sources/js/main.js -o sources/js/bundle.js",
```

## Set up
1. Clone repository:
```
git clone https://github.com/velomovies/performance-matters-server-side.git
```
2. Install dependencies:
```
npm install
```

3. Build and start server:
```
npm start
```
    
4. Open [127.0.0.1:8000](127.0.0.1:8000) in your browser to see the app