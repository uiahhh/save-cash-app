# ![SaveCash](logo.png)

> ### Angular5 + Firebase app.

SaveCash is a mobile hibrid app for control finance.
This app is ready to be published in the store, through encapsulation by Cordova. Also has Service Worker and Manifest configured, characterizing it as a PWA.

## Demo
[Access save-cash-app in firebase host](https://save-cash-app.firebaseapp.com)

## Screens
(screens/01.png) (screens/02.png) (screens/03.png)

## What you will find here

- Angular 5.x
- Firebase with AngularFire2
- Firebase Auth
- Firebase Firestore
- Service Worker
- Reactive Forms
- Routers
- Cordova
- Materialize-css

## First install node packages
run: npm install

## Set Environment Settings
Change files **environment.ts** and **environment.prod.ts**.
Put your app settings, do you get the settings in [Firebase Console](https://console.firebase.google.com):
 - Join in firebase console
 - Click in one project 
 *(if you don't have any project, create one, is free)*
 - Click in "ADD OTHER APP"
 - Select "FIREBASE WEB"
 
 You should be see this:

```html
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "XXxxxxXXXXXXXXxxxxx__XXXxxxxXXXXXxxxxxx",
    authDomain: "your-app-name.firebaseapp.com",
    databaseURL: "https://your-app-name.firebaseio.com",
    projectId: "your-app-name",
    storageBucket: "your-app-name.appspot.com",
    messagingSenderId: "000000000000"
  };
  firebase.initializeApp(config);
</script>
```


## Run in browser
run: ng serve

## Build
run: ng build --prod

## Deploy in Firebase
run: firebase deploy

## Generate APK
run: cordova build android
Your APK path: "platforms\android\build\outputs\apk"


