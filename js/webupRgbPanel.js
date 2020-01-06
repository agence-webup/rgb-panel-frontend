let webupRgb;
let canvas;
let messageBox;
let colorInput;
let colorPreview;
let pencilButton;
let eraserButton;
let thicknessControl;
let sendButton;

let matrix = [];

let height;
let width;
let matrixCol = [];
let canvasDrawn = false;

let apiEndpoint;

// Drawing parameters
/*
                modes:
                    0 - erase mode
                    1 - draw mode
            */
let mode = 1;

/*
                thickness:
                    <1|2|3>
            */
let thickness = 1;

/* 
                input color:
                    <hex value>
            */
let color = "#00F";

/*
                mouseDown:
                    boolean
            */
let mouseDown = false;

/*
                visibility of thickness panel:
                    boolean
            */
let thicknessPanelVisible = false;

function webupRgbPanel(params) {

  if (typeof params.panelId !== "string") {
    throw new Error("The `panelId` parameter must be a string");
  }
  
  if (typeof params.toolsId !== "string") {
    throw new Error("The `toolsId` parameter must be a string");
  }

  if (!Number.isInteger(params.widthValue)) {
    throw new Error("The `widthValue` parameter must be an integer");
  }

  if (!Number.isInteger(params.heightValue)) {
    throw new Error("The `heightValue` parameter must be an integer");
  }

  if (typeof params.endpoint !== "string") {
    throw new Error("The `endpoint` parameter must be a string")
  }

  apiEndpoint = params.endpoint

  webupRgb = document.getElementById('webup_rgb');

  canvas = document.getElementById(params.panelId);

  let tools = document.getElementById(params.toolsId);
  height = params.heightValue;
  width = params.widthValue;

  let pencilNode = document.createElement("a");
  let pencilInputNode = document.createElement("img");

  pencilInputNode.setAttribute("src", "img/pencil.svg");
  pencilInputNode.setAttribute("alt", "pencil");
  pencilInputNode.setAttribute("id", "pencil");

  let thicknessNode = document.createElement("span");
  let thicknessInputNode = document.createElement("input");

  thicknessInputNode.setAttribute("type", "range");
  thicknessInputNode.setAttribute("id", "thickness");
  thicknessInputNode.setAttribute("min", "1");
  thicknessInputNode.setAttribute("max", "3");
  thicknessInputNode.setAttribute("step", "1");

  let eraserNode = document.createElement("a");
  let eraserInputNode = document.createElement("img");

  eraserInputNode.setAttribute("src", "img/eraser.svg");
  eraserInputNode.setAttribute("alt", "eraser");
  eraserInputNode.setAttribute("id", "eraser");

  let colorInputNode = document.createElement("input");

  colorInputNode.setAttribute("type", "color");
  colorInputNode.setAttribute("id", "colorInput");
  colorInputNode.setAttribute("value", "#00F");
  colorInputNode.setAttribute("hidden", "");

  let colorNode = document.createElement("span");
  colorNode.setAttribute("id", "color");

  let textInputNode = document.createElement("input");

  textInputNode.setAttribute("type", "text");
  textInputNode.setAttribute("id", "message");

  let sendButtonNode = document.createElement("button");
  sendButtonNode.setAttribute("id", "send");
  let buttonTextNode = document.createTextNode("Envoyer");

  pencilNode.appendChild(pencilInputNode);
  thicknessNode.appendChild(thicknessInputNode);
  pencilNode.appendChild(thicknessNode);

  eraserNode.appendChild(eraserInputNode);

  sendButtonNode.appendChild(buttonTextNode);

  tools.append(pencilNode);
  tools.append(eraserNode);
  tools.append(colorInputNode);
  tools.append(colorNode);
  webupRgb.parentNode.insertBefore(sendButtonNode, webupRgb.nextSibling);
  webupRgb.parentNode.insertBefore(textInputNode, webupRgb.nextSibling);

  messageBox = document.getElementById("message");
  pencilButton = document.getElementById("pencil");
  eraserButton = document.getElementById("eraser");
  colorInput = document.getElementById("colorInput");
  colorPreview = document.getElementById("color");
  thicknessControl = document.getElementById("thickness");
  sendButton = document.getElementById("send");

  init();

  canvas.addEventListener("mousedown", () => {
    mouseDown = true;
  });

  canvas.addEventListener("touchstart", () => {
    mouseDown = true;
  })

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("touchend", () => {
    mouseDown = false;
  })

  canvas.addEventListener("mousemove", e => {
    if (mouseDown == true) {
      let mouseX = e.pageX - canvas.offsetLeft;
      let mouseY = e.pageY - canvas.offsetTop;
      //console.log("mouseMove", "x:", mouseX, "y:", mouseY)
      drawOnCanvas((x = mouseX), (y = mouseY), (color = color));
    }
  });

  canvas.addEventListener("touchmove", e => {
    if (mouseDown == true) {
      let mouseX = e.pageX - canvas.offsetLeft;
      let mouseY = e.pageY - canvas.offsetTop;
      drawOnCanvas((x = mouseX), (y = mouseY), (color = color));
    }
  })

  colorPreview.addEventListener("click", function() {
    colorInput.focus();
    colorInput.value = color;
    colorInput.click();
  });

  colorInput.addEventListener("change", function() {
    // Immediately set mode to draw when color is picked
    mode = 1;
    color = colorInput.value;
    colorPreview.style.backgroundColor = color;
  });

  sendButton.onclick = event => {
    send();
  };

  thicknessControl.addEventListener("change", function() {
    let chosenThickness = thicknessControl.value;

    // Because `<input type="range">` can't be set to have the exact scale we want, lo and behold: clunky code below
    switch (chosenThickness) {
      case "1": // single dot
        thickness = 1;
        break;

      case "2": // 2x2 square
        thickness = 2;
        break;

      case "3": // 3x3 square
        thickness = 3;
        break;
    }
  });

  pencilButton.onclick = event => {
    if (mode != 1) {
      mode = 1;
      if (eraserButton.classList.contains("toolSelected")) {
        eraserButton.classList.remove("toolSelected");
      }
      pencilButton.classList.add("toolSelected");
    }
  };

  eraserButton.onclick = event => {
    if (mode != 0) {
      mode = 0;
      if (pencilButton.classList.contains("toolSelected")) {
        pencilButton.classList.remove("toolSelected");
      }
      eraserButton.classList.add("toolSelected");
    }
  };
}

function init() {
  // reset matrix just in case
  matrix = [];

  // create columns
  for (i = 0; i < height; i++) {
    matrixCol.push("#000");
  }

  // create columns
  for (i = 0; i < width; i++) {
    matrix.push(matrixCol);
  }

  messageBox.value = null;
  drawCanvas();

  pencilButton.classList.add("toolSelected");
}

function drawCanvas() {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
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
    for (i = 0; i < matrix.length; i++) {
      // loop again through items in row, draw them
      for (j = 0; j < matrix[i].length; j++) {
        ctx.strokeStyle = "#909090";
        ctx.strokeRect(x, y, 13, 13);
        ctx.fillStyle = "#777777";
        ctx.fillRect(x + 1, y + 1, 12, 12);
        ctx.fillStyle = matrix[i][j] == "#000" ? "#BABABA" : matrix[i][j];
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

function drawOnCanvas(x, y, color) {
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

  if (thickness > 1) {
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

  if (thickness > 2) {
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

  for (i = 0; i < matrix.length; i++) {
    // there's some heavy use of JSON.stringify() and JSON.parse() here because we need to actually make copies of each variable
    // rather than passing a reference, in order to counteract JavaScript's default behavior
    let tempArray = [];
    tempArray = JSON.parse(JSON.stringify(matrix[i]));

    if (xCoords.includes(i)) {
      if (mode == 1) {
        for (j = 0; j < yCoords.length; j++) {
          tempArray[yCoords[j]] = color;
        }
        //tempArray[pixelY] = color
      }
      if (mode == 0) {
        tempArray[pixelY] = "#000";
      }
    }

    newMatrix.push(JSON.parse(JSON.stringify(tempArray)));
  }

  matrix = newMatrix;

  // redraw new point on the panel if the thickness is 1
  if (thickness == 1) {
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle =
      matrix[pixelX][pixelY] == "#000" ? "#BABABA" : matrix[pixelX][pixelY];
    ctx.fillRect(pixelX * 13 + 3, pixelY * 13 + 3, 8, 8);
  } else {
    drawCanvas();
  }
}

function sendDrawing() {
  let drawing = [];
  for (i = 0; i < matrix.length; i++) {
    for (j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] != "#000") {
        let rgb = hexToRgb(matrix[i][j]);
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
  req.addEventListener("load", sendComplete);
  req.addEventListener("error", sendError);
  req.open("POST", `${apiEndpoint}/send/drawing`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(drawingJson));
}

function sendMessage() {
  let msg = messageBox.value;

  let msgJson = {
    text: msg
  };

  let req = new XMLHttpRequest();
  req.addEventListener("load", sendComplete);
  req.addEventListener("error", sendError);
  req.open("POST", `${apiEndpoint}/send/message`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(msgJson));
}

function hexToRgb(hex) {
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

function sendComplete() {
  init();
}

function sendError() {
  alert("Une erreur est survenue");
}

function send() {
  if (messageBox.value.length > 0) {
    sendMessage();
  } else {
    sendDrawing();
  }
}
