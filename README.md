# rgb-panel-frontend
Frontend for the RGB Panel project.

Written in vanilla JS & HTML/CSS.

Uses a [`rgb-panel-api`](https://github.com/agence-webup/rgb-panel-api) endpoint to send drawings and text for display on an RGB panel.

## local dev

```
npm install
npm run dev
```

## Setup

### In your own project
If your project already uses `npm` you can simply add the frontend library to your dependencies
```bash
npm i @agence-webup/rgb-panel-frontend
```

Copy the `dist/` folder to your public web directory, either using a build tool such as Gulp or manually.

Now we need to set up a page to use the library. The following code is merely an example:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rgb-panel-frontend</title>
    <link rel="stylesheet" href="webup-rgb-panel.css">
    <style>
    html {
      font-size: 62.5%;
      font-size: calc(1em * 0.625);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .ma {
        margin-top: 2rem;
    }
    </style>
</head>
<body>
    <h1>Webup RGB Panel</h1>
    <div class="rgbpanel">
        <div class="rgbpanel__tools" data-rgbpanel-tools></div>
        <canvas id="panel" width="832" height="416" class="rgbpanel__canvas" 
        data-rgbpanel></canvas>
    </div>
    <div class="ma">
      <button data-send>Envoyer</button>
      <button data-clear>Effacer</button>
    </div>
    <script src="webup-rgb-panel.js"></script>
    <script>
        let webupRGBPanel = new WebupRGBPanel(
            document.querySelector('[data-rgbpanel]'), 
            document.querySelector('[data-rgbpanel-tools]'), 
            64, 
            32, 
            "https://example.com/api"
        )

        document.querySelector('[data-send]').addEventListener('click', () => {
            webupRGBPanel.send()
        })

        document.querySelector('[data-clear]').addEventListener('click', () => {
            webupRGBPanel.clear()
        })
    </script>
</body>
</html>
```

> **Note**: If you've deployed [rgb-panel-worker]("https://github.com/agence-webup/rgb-panel-worker") using ZEIT functions, don't forget to specify `/api` at the end of the URL you provide. If you're using the Express server, you can simply specify the URL. 
> Notice there should **not** be any trailing slash.