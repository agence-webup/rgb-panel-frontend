// TODO: package as ES6 class
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

class WebupRgb {
  constructor(panelId, toolsId, widthValue, heightValue, endpoint) {
    this.panelId = panelId
    this.toolsId = toolsId
    this.width = widthValue
    this.height = heightValue
    this.apiEndpoint = endpoint
    this.matrix = []

    // Drawing parameters
    /*
    modes: 
    0 - erase mode
    1 - draw mode
    */
    this.mode = 1

    /*
   thickness: <1|2|3>
   */
    this.thickness = 1

    /*
   input color: <hex value>
   */
    this.color = "#00F"

    /*
   mouseDown: boolean
   */
    this.mouseDown = false

    /*
   visibility of thickness panel: boolean
   */
    this.thicknessPanelVisible = false;

    this.rgbWrapper = document.getElementById("webup_rgb");

    this.canvas = document.getElementById(this.panelId);

    this.tools = document.getElementById(this.toolsId);

    let toolsMarkup = `
    <a>
      <img id="pencil" src="img/pencil.svg" alt="pencil">
      <span>
        <input type="range" id="thickness" min="1" max="3" step="1">
      </span>
    </a>
    <a>
      <img src="img/eraser.svg" alt="eraser" id="eraser">
    </a>
    <span id="colorWrapper">
      <input type="color" id="colorInput" value="#00F">
      <span id="color"></span>
    </span>
    `

    let textInputMarkup = `<input type="text" id="message">`

    let sendButtonMarkup = `<button id="send">Envoyer</button>`

    this.tools.insertAdjacentHTML('afterbegin', toolsMarkup)

    this.rgbWrapper.insertAdjacentHTML('afterend', textInputMarkup)
    this.rgbWrapper.insertAdjacentHTML('afterend', sendButtonMarkup)

    this.messageBox = document.getElementById("message")
    this.pencilButton = document.getElementById("pencil")
    this.eraserButton = document.getElementById("eraser")
    this.colorInput = document.getElementById("colorInput")
    this.colorPreview = document.getElementById("color")
    this.thicknessControl = document.getElementById("thickness")
    this.sendButton = document.getElementById("send")

    this.init()

    this.canvas.addEventListener("mousedown", () => {
      this.mouseDown = true
    });
  
    this.canvas.addEventListener("touchstart", () => {
      this.mouseDown = true
    });
  
    this.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false
    });
  
    this.canvas.addEventListener("touchend", () => {
      this.mouseDown = false
    });
  
    this.canvas.addEventListener("mousemove", e => {
      if (this.mouseDown == true) {
        let canvasWidth = panel.getBoundingClientRect().width
        let imageWidth = this.matrix.length * 13
  
        let ratio = imageWidth / canvasWidth
  
        let mouseX = (e.pageX - this.canvas.offsetLeft) * ratio
        let mouseY = (e.pageY - this.canvas.offsetTop) * ratio
  
        this.drawOnCanvas(mouseX, mouseY, color)
      }
    });
  
    this.canvas.addEventListener("touchmove", e => {
      if (tihs.mouseDown == true) {
        e.preventDefault()
        let canvasWidth = this.panel.getBoundingClientRect().width
        let imageWidth = this.matrix.length * 13
  
        let ratio = imageWidth / canvasWidth
  
        let mouseX = (e.pageX - canvas.offsetLeft) * ratio
        let mouseY = (e.pageY - canvas.offsetTop) * ratio
  
        this.drawOnCanvas((x = mouseX), (y = mouseY), (color = color))
      }
    });
  
    this.colorPreview.addEventListener("click", function() {
      colorInput.value = color
    });
  
    this.colorInput.addEventListener("change", function() {
      // Immediately set mode to draw when color is picked
      this.mode = 1
      this.color = colorInput.value
      this.colorPreview.style.backgroundColor = this.color
    });
  
    this.sendButton.onclick = event => {
      this.send()
    }
  
    this.thicknessControl.addEventListener("change", function() {
      let chosenThickness = this.thicknessControl.value
  
      // Because `<input type="range">` can't be set to have the exact scale we want, lo and behold: clunky code below
      switch (chosenThickness) {
        case "1": // single dot
          thickness = 1
          break
  
        case "2": // 2x2 square
          thickness = 2
          break
  
        case "3": // 3x3 square
          thickness = 3
          break
      }
    })
  
    this.pencilButton.onclick = event => {
      if (this.mode != 1) {
        this.mode = 1
        if (this.eraserButton.classList.contains("toolSelected")) {
          this.eraserButton.classList.remove("toolSelected")
        }
        this.pencilButton.classList.add("toolSelected")
      }
    }
  
    this.eraserButton.onclick = event => {
      if (this.mode != 0) {
        this.mode = 0;
        if (this.pencilButton.classList.contains("toolSelected")) {
          this.pencilButton.classList.remove("toolSelected")
        }
        this.eraserButton.classList.add("toolSelected")
      }
    }
  }

  init() {
    // reset matrix just in case
    this.matrix = []
    let matrixCol = []

    // create columns
    for (let i = 0; i < this.height; i++) {
      matrixCol.push("#000")
    }

    // create columns
    for (let i = 0; i < this.width; i++) {
      this.matrix.push(matrixCol)
    }

    this.drawCanvas()

    this.pencilButton.classList.add("toolSelected")
  }

  drawCanvas() {
    if (this.canvas.getContext) {
      var ctx = this.canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.lineWidth = 1;
  
      // start with x = y = 0
      // these are used as coordinates for drawing each "pixel"
      let x = 0;
      let y = 0;
  
      // start with x2 = y2 = 3
      // as x and y above, but for the inner square, which actually displays the color
      let x2 = 3;
      let y2 = 3;
  
      // loop through rows and draw them
      for (let i = 0; i < this.matrix.length; i++) {
        // loop again through items in row, draw them
        for (let j = 0; j < this.matrix[i].length; j++) {
          ctx.strokeStyle = "#909090";
          ctx.strokeRect(x, y, 13, 13);
          ctx.fillStyle = "#777777";
          ctx.fillRect(x + 1, y + 1, 12, 12);
          ctx.fillStyle = this.matrix[i][j] == "#000" ? "#BABABA" : this.matrix[i][j];
          ctx.fillRect(x2, y2, 8, 8);
  
          // bump up x coordinates for next iteration
          y += 13;
          y2 += 13;
        }
  
        // reinitialize coordinates for next line
        x += 13;
        y = 0;
  
        x2 += 13;
        y2 = 3;
      }
    }
  }


  drawOnCanvas(x, y, color) {
    // figure out which pixel in the matrix should be changed
    // this shouldn't be too difficult given the fact that each square drawn on the canvas is
    // mapped as 1:1 to a "pixel" in the matrix that controls the canvas-drawn matrix
  
    // each square on the canvas is 13x13 pixels, so we can perform a floor division on the coordinate to get its position in the matrix
  
    let pixelX = Math.abs(Math.floor(x / 13));
    let pixelY = Math.abs(Math.floor(y / 13));
  
    let xCoords = [];
    let yCoords = [];
  
    // add single point
    xCoords.push(pixelX);
    yCoords.push(pixelY);
  
    if (this.thickness > 1) {
      // produces a shape like this:
      // 11
      // 11
  
      if (pixelY - 1 >= 0) {
        yCoords.push(pixelY - 1);
      }
      if (pixelX + 1 <= width - 1) {
        xCoords.push(pixelX + 1);
      }
    }
  
    if (this.thickness > 2) {
      // produces a shape like this:
      // 111
      // 111
      // 111
  
      if (pixelX - 1 >= 0) {
        xCoords.push(pixelX - 1);
      }
  
      if (pixelY + 1 <= width - 1) {
        yCoords.push(pixelY + 1);
      }
    }
  
    let newMatrix = [];
  
    for (let i = 0; i < this.matrix.length; i++) {
      // there's some heavy use of JSON.stringify() and JSON.parse() here because we need to actually make copies of each variable
      // rather than passing a reference, in order to counteract JavaScript's default behavior
      let tempArray = [];
      tempArray = JSON.parse(JSON.stringify(this.matrix[i]));
  
      if (xCoords.includes(i)) {
        if (this.mode == 1) {
          for (let j = 0; j < yCoords.length; j++) {
            tempArray[yCoords[j]] = this.color;
          }
          //tempArray[pixelY] = color
        }
        if (this.mode == 0) {
          tempArray[pixelY] = "#000";
        }
      }
  
      newMatrix.push(JSON.parse(JSON.stringify(tempArray)));
    }
  
    this.matrix = newMatrix;
  
    // redraw new point on the panel if the thickness is 1
    if (this.thickness == 1) {
      var ctx = this.canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = 
          this.matrix[pixelX][pixelY] == "#000" ? "#BABABA" : this.matrix[pixelX][pixelY];
      ctx.fillRect(pixelX * 13 + 3, pixelY * 13 + 3, 8, 8);
    } else {
      this.drawCanvas();
    }
  }

  sendDrawing() {
    let drawing = [];
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] != "#000") {
          let rgb = this.hexToRgb(this.matrix[i][j]);
          drawing.push({
            // using the + operand in order to make sure integers are being passed into the object
            x: +i,
            y: +j,
            r: +rgb.r,
            g: +rgb.g,
            b: +rgb.b
          });
        }
      }
    }
  
    let drawingJson = {
      drawing: drawing
    };
  
    // if drawing is empty, inform the user and cancel
    if (drawing.length < 1) {
      alert("Dessinez ou écrivez quelque chose à envoyer !");
      return false;
    }
  
    let req = new XMLHttpRequest();
    req.addEventListener("load", this.sendComplete);
    req.addEventListener("error", this.sendError);
    req.open("POST", `${this.apiEndpoint}/send/drawing`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(drawingJson));
  }
  
  sendMessage() {
    let msg = this.messageBox.value;
  
    let msgJson = {
      text: msg
    };
  
    let req = new XMLHttpRequest();
    req.addEventListener("load", this.sendComplete);
    req.addEventListener("error", this.sendError);
    req.open("POST", `${this.apiEndpoint}/send/message`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(msgJson));
  }
  
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
  
  sendComplete() {
    this.init();
  }
  
  sendError() {
    alert("Une erreur est survenue");
  }
  
  send() {
    if (this.messageBox.value.length > 0) {
      this.sendMessage();
    } else {
      this.sendDrawing();
    }
  }
}