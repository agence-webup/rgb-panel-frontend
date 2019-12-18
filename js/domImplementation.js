// Generate matrix markup
let lineCount = 32;
let colCount = 64;

let pixel = document.createElement("div");
pixel.className = "pixel";

let pixelBorder = document.createElement("span");
pixelBorder.className = "pixelBorder";

let column = document.createElement("div");
column.className = "col";

let panel = document.getElementById("panel");
for (let i = 0; i < colCount; i++) {
  let newCol = column.cloneNode((deep = true));
  //            newCol.setAttribute('data-x', `${i}`)
  panel.appendChild(newCol);
}

let columns = document.querySelectorAll(".col");
for (let i = 0; i < columns.length; i++) {
  for (let j = 0; j < lineCount; j++) {
    let newPixelBorder = pixelBorder.cloneNode((deep = true));
    newPixelBorder.setAttribute("data-coord-x-for-child", `${i}`);
    newPixelBorder.setAttribute("data-coord-y-for-child", `${j}`);
    columns[i].appendChild(newPixelBorder);
  }
}

let pixels = document.querySelectorAll(".pixelBorder");
for (let i = 0; i < pixels.length; i++) {
  let newPixel = pixel.cloneNode((deep = true));
  let x_coord = pixels[i].getAttribute("data-coord-x-for-child");
  let y_coord = pixels[i].getAttribute("data-coord-y-for-child");
  newPixel.setAttribute("data-x", `${x_coord}`);
  newPixel.setAttribute("data-y", `${y_coord}`);
  pixels[i].removeAttribute("data-coord-x-for-child");
  pixels[i].removeAttribute("data-coord-y-for-child");
  pixels[i].appendChild(newPixel);
}

// Drawing stuff
/*
            modes:
                0 - erase mode
                1 - draw mode
        */
let mode = 1;

/*
            thickness:
                <1|2|4|8>
        */
let thickness = 1;

/* 
            input color:
                <hex value>
        */
let color = "#00F";

/*
            visibility of thickness panel:
                boolean
        */
let thicknessPanelVisible = false;

let mouseDown = false;
let mouse = document.getElementById("mouse");
panel.addEventListener("mousedown", () => {
  mouse.textContent = "Pressed";
  mouseDown = true;
});

panel.addEventListener("mouseup", () => {
  mouse.textContent = "Released";
  mouseDown = false;
});

let pencilButton = document.getElementById("pencil");
pencilButton.onclick = event => {
  if (mode == 1) {
    if (thicknessPanelVisible == false) {
      setThicknessPanel((visible = true));
    } else {
      setThicknessPanel((visible = false));
    }
  } else {
    mode = 1;
  }
};

let eraserButton = document.getElementById("eraser");
eraserButton.onclick = event => {
  if (mode == 0) {
    if (thicknessPanelVisible == false) {
      setThicknessPanel((visible = true));
    } else {
      setThicknessPanel((visible = false));
    }
  } else {
    mode = 0;
  }
};

panel.onmouseover = event => {
  let target = event.target;

  if (target.firstElementChild === null) return;

  if (mouseDown == true) {
    colorPixel(target.firstElementChild);
  }
};

function colorPixel(pixel) {
  selectedPixel = pixel;

  // if in draw mode, add color and data-color attribute to node
  if (mode == 1) {
    selectedPixel.setAttribute("data-color", color);
    selectedPixel.setAttribute("style", "background-color: " + color);
  }
  // if in erase mode, remove inline styling and data-color attribute from node
  if (mode == 0) {
    selectedPixel.removeAttribute("data-color");
    selectedPixel.removeAttribute("style");
  }
}

function setColor() {
  // Immediately set mode to draw when color is picked
  mode = 1;
  color = document.getElementById("color").value;
}

function setThicknessPanel(visible) {
  let thicknessPanel = document.getElementById("thickness-panel");

  if (visible == true) {
    thicknessPanel.setAttribute("style", "display: inline;");
    thicknessPanelVisible = true;
  }
  if (visible == false) {
    thicknessPanel.removeAttribute("style");
    thicknessPanelVisible = false;
  }
}

function setSize() {
  let chosenThickness = document.getElementById("thickness").value;

  // Because `<input type="range">` can't be set to have the exact scale we want, lo and behold: clunky code below
  switch (chosenThickness) {
    case "1":
      thickness = 1;
      break;

    case "2":
      thickness = 2;
      break;

    case "3":
      thickness = 4;
      break;

    case "4":
      thickness = 8;
      break;
  }

  let thicknessDisplay = document.getElementById("thicknessValue");
  thicknessDisplay.textContent = thickness;
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function drawingToJson() {
  let pixels = document.getElementsByClassName("pixel");
  let drawing = [];

  for (i = 0; i < pixels.length; i++) {
    if (pixels[i].hasAttribute("data-color")) {
      let rgb = hexToRgb(pixels[i].getAttribute("data-color"));

      drawing.push({
        x: +pixels[i].getAttribute("data-x"),
        y: +pixels[i].getAttribute("data-y"),
        r: +rgb.r,
        g: +rgb.g,
        b: +rgb.b
      });
    }
  }

  // console.log(JSON.stringify(drawing))
  let drawingJson = {
    drawing: drawing
  };

  let req = new XMLHttpRequest();
  req.addEventListener("load", sendComplete);
  req.addEventListener("error", sendError);
  req.open("POST", "http://localhost:3000/send/drawing");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(drawingJson));
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
  alert("Envoyé");
  let pixels = document.getElementsByClassName("pixel");

  for (i = 0; i < pixels.length; i++) {
    pixels[i].removeAttribute("data-color");
    pixels[i].removeAttribute("style");
  }
}

function sendError() {
  alert("Une erreur est survenue");
}
