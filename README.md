# HtmlMaterial Demo

*Custom material to display webpages on 3D surfaces in BabylonJS.* 

This demo application includes a custom material class called **HtmlMaterial**. This class loads a webpage via a hidden iframe, creates an image texture based on that webpage, and uses that texture as the `emissiveTexture` for the material.

## Developer prerequisites

- NPM installed
- Working knowledge of TypeScript
- *Recommended:* VS Code (or your preferred code editor)

## Developer workflow

(Initial setup) From a terminal window, navigate to the root of the project and run:

```
npm install
```

To launch the demo application, run:

```
npm start
```

This will automatically start a local web server and provide live reloading of code changes as you work. When you want to stop the server, press `Ctrl-C` in the terminal.

## Deploying the application to production

If you'd like to deploy the application to a public web server, do the following.

Compile the application by running:

```
npm run build
```

This will generate all the necessary files in a folder called "dist". The contents of this folder can then be deployed to your web server.