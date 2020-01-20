/*!
 * WebupRGBPanel v1.0.0
 * (c) 2016-2020 Agence Webup
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.WebupRGBPanel = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var WebupRgbPanel =
  /*#__PURE__*/
  function () {
    function WebupRgbPanel(panelId, toolsId, widthValue, heightValue, endpoint, sendButtonId, clearButtonId) {
      var _this = this;

      _classCallCheck(this, WebupRgbPanel);

      this.panelId = panelId;
      this.toolsId = toolsId;
      this.width = widthValue;
      this.height = heightValue;
      this.apiEndpoint = endpoint;
      this.matrix = []; // Drawing parameters

      /*
      modes:
      0 - erase mode
      1 - draw mode
      */

      this.mode = 1;
      /*
      thickness: <1|2|3>
      */

      this.thickness = 1;
      /*
      input color: <hex value>
      */

      this.color = '#00F';
      /*
      mouseDown: boolean
      */

      this.mouseDown = false;
      /*
      visibility of thickness panel: boolean
      */

      this.thicknessPanelVisible = false;
      this.rgbWrapper = document.getElementById('webup_rgb');
      this.canvas = document.getElementById(this.panelId);
      this.tools = document.getElementById(this.toolsId);
      this.sendButton = document.getElementById(sendButtonId);
      this.clearButton = document.getElementById(clearButtonId);
      var toolsMarkup = "\n    ".concat(this.assetSize(1), "\n    ").concat(this.assetSize(2), "\n    ").concat(this.assetSize(3), "\n    <a>\n      <img id=\"pencil\" src=\"").concat(this.assetPencil(), "\" alt=\"pencil\">\n    </a>\n    <a>\n      <img src=\"").concat(this.assetEraser(), "\" alt=\"eraser\" id=\"eraser\">\n    </a>\n    <span id=\"colorWrapper\">\n      <input type=\"color\" id=\"colorInput\" value=\"#00F\">\n      <img src=\"").concat(this.assetColorPalette(), "\" id=\"color\">\n    </span>\n    ");
      this.tools.insertAdjacentHTML('afterbegin', toolsMarkup);
      this.messageBox = document.getElementById('message');
      this.pencilButton = document.getElementById('pencil');
      this.eraserButton = document.getElementById('eraser');
      this.colorInput = document.getElementById('colorInput');
      this.colorPreview = document.getElementById('color');
      this.thicknessSize1 = document.getElementById('size1');
      this.thicknessSize2 = document.getElementById('size2');
      this.thicknessSize3 = document.getElementById('size3');
      this.sendButton = document.getElementById('send');
      this.init();
      this.canvas.addEventListener('mousedown', function () {
        _this.mouseDown = true;
      });
      this.canvas.addEventListener('touchstart', function () {
        _this.mouseDown = true;
      });
      this.canvas.addEventListener('mouseup', function () {
        _this.mouseDown = false;
      });
      this.canvas.addEventListener('touchend', function () {
        _this.mouseDown = false;
      });
      this.canvas.addEventListener('mousemove', function (e) {
        if (_this.mouseDown === true) {
          var canvasWidth = _this.canvas.getBoundingClientRect().width;

          var imageWidth = _this.matrix.length * 13;
          var ratio = imageWidth / canvasWidth;
          var mouseX = (e.pageX - _this.canvas.offsetLeft) * ratio;
          var mouseY = (e.pageY - _this.canvas.offsetTop) * ratio;

          _this.drawOnCanvas(mouseX, mouseY, _this.color);
        }
      });
      this.canvas.addEventListener('touchmove', function (e) {
        if (_this.mouseDown === true) {
          e.preventDefault();

          var canvasWidth = _this.canvas.getBoundingClientRect().width;

          var imageWidth = _this.matrix.length * 13;
          var ratio = imageWidth / canvasWidth;
          var mouseX = (e.pageX - _this.canvas.offsetLeft) * ratio;
          var mouseY = (e.pageY - _this.canvas.offsetTop) * ratio;

          _this.drawOnCanvas(mouseX, mouseY, _this.color);
        }
      });
      this.colorPreview.addEventListener('click', function () {
        _this.colorInput.value = _this.color;
      });
      this.colorInput.addEventListener('change', function () {
        _this.setColor();
      });
      this.colorInput.addEventListener('input', function () {
        _this.setColor();
      });
      this.thicknessSize1.addEventListener('click', function () {
        _this.setThickness(_this.thicknessSize1);
      });
      this.thicknessSize2.addEventListener('click', function () {
        _this.setThickness(_this.thicknessSize2);
      });
      this.thicknessSize3.addEventListener('click', function () {
        _this.setThickness(_this.thicknessSize3);
      });
      this.pencilButton.addEventListener('click', function () {
        if (_this.mode !== 1) {
          _this.mode = 1;

          if (_this.eraserButton.classList.contains('toolSelected')) {
            _this.eraserButton.classList.remove('toolSelected');
          }

          _this.pencilButton.classList.add('toolSelected');
        }
      });
      this.eraserButton.addEventListener('click', function () {
        if (_this.mode !== 0) {
          _this.mode = 0;

          if (_this.pencilButton.classList.contains('toolSelected')) {
            _this.pencilButton.classList.remove('toolSelected');
          }

          _this.eraserButton.classList.add('toolSelected');
        }
      });
      this.sendButton.addEventListener('click', function () {
        _this.send();
      });
      this.clearButton.addEventListener('click', function () {
        _this.init();
      });
    }

    _createClass(WebupRgbPanel, [{
      key: "init",
      value: function init() {
        // reset matrix just in case
        this.matrix = [];
        var matrixCol = []; // create columns

        for (var i = 0; i < this.height; i++) {
          matrixCol.push('#000');
        } // create columns


        for (var _i = 0; _i < this.width; _i++) {
          this.matrix.push(matrixCol);
        }

        this.drawCanvas();
        this.pencilButton.classList.add('toolSelected');
        var smallFill = document.getElementById('smallFill');
        smallFill.setAttribute('fill', this.color);
        var mediumFill = document.getElementById('mediumFill');
        mediumFill.setAttribute('fill', this.color);
        var largeFill = document.getElementById('largeFill');
        largeFill.setAttribute('fill', this.color);
      }
    }, {
      key: "setThickness",
      value: function setThickness(elementClicked) {
        if (this.thicknessSize1.classList.contains('toolSelected')) {
          this.thicknessSize1.classList.remove('toolSelected');
        }

        if (this.thicknessSize2.classList.contains('toolSelected')) {
          this.thicknessSize2.classList.remove('toolSelected');
        }

        if (this.thicknessSize3.classList.contains('toolSelected')) {
          this.thicknessSize3.classList.remove('toolSelected');
        }

        switch (elementClicked.id) {
          case 'size1':
            this.thickness = 1;
            break;

          case 'size2':
            this.thickness = 2;
            break;

          case 'size3':
            this.thickness = 3;
            break;
        }

        elementClicked.classList.add('toolSelected');
        var smallFill = document.getElementById('smallFill');
        smallFill.setAttribute('fill', this.color);
        var mediumFill = document.getElementById('mediumFill');
        mediumFill.setAttribute('fill', this.color);
        var largeFill = document.getElementById('largeFill');
        largeFill.setAttribute('fill', this.color);
      }
    }, {
      key: "setColor",
      value: function setColor() {
        // Immediately set mode to draw when color is picked
        this.mode = 1;

        if (!this.pencilButton.classList.contains('toolSelected')) {
          this.pencilButton.classList.add('toolSelected');
        }

        if (this.eraserButton.classList.contains('toolSelected')) {
          this.eraserButton.classList.remove('toolSelected');
        }

        this.color = this.colorInput.value;
        this.colorPreview.style.backgroundColor = this.color;
        var smallFill = document.getElementById('smallFill');
        smallFill.setAttribute('fill', this.color);
        var mediumFill = document.getElementById('mediumFill');
        mediumFill.setAttribute('fill', this.color);
        var largeFill = document.getElementById('largeFill');
        largeFill.setAttribute('fill', this.color);
      }
    }, {
      key: "drawCanvas",
      value: function drawCanvas() {
        if (this.canvas.getContext) {
          var ctx = this.canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.lineWidth = 1; // start with x = y = 0
          // these are used as coordinates for drawing each "pixel"

          var x = 0;
          var y = 0; // start with x2 = y2 = 3
          // as x and y above, but for the inner square, which actually displays the color

          var x2 = 3;
          var y2 = 3; // loop through rows and draw them

          for (var i = 0; i < this.matrix.length; i++) {
            // loop again through items in row, draw them
            for (var j = 0; j < this.matrix[i].length; j++) {
              ctx.strokeStyle = '#909090';
              ctx.strokeRect(x, y, 13, 13);
              ctx.fillStyle = '#777777';
              ctx.fillRect(x + 1, y + 1, 12, 12);
              ctx.fillStyle = this.matrix[i][j] == '#000' ? '#BABABA' : this.matrix[i][j];
              ctx.fillRect(x2, y2, 8, 8); // bump up x coordinates for next iteration

              y += 13;
              y2 += 13;
            } // reinitialize coordinates for next line


            x += 13;
            y = 0;
            x2 += 13;
            y2 = 3;
          }
        }
      }
    }, {
      key: "drawOnCanvas",
      value: function drawOnCanvas(x, y, color) {
        // figure out which pixel in the matrix should be changed
        // this shouldn't be too difficult given the fact that each square drawn on the canvas is
        // mapped as 1:1 to a "pixel" in the matrix that controls the canvas-drawn matrix
        // each square on the canvas is 13x13 pixels, so we can perform a floor division on the coordinate to get its position in the matrix
        var pixelX = Math.abs(Math.floor(x / 13));
        var pixelY = Math.abs(Math.floor(y / 13));
        var xCoords = [];
        var yCoords = []; // add single point

        xCoords.push(pixelX);
        yCoords.push(pixelY);

        if (this.thickness > 1) {
          // produces a shape like this:
          // 11
          // 11
          if (pixelY - 1 >= 0) {
            yCoords.push(pixelY - 1);
          }

          if (pixelX + 1 <= this.width - 1) {
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

          if (pixelY + 1 <= this.width - 1) {
            yCoords.push(pixelY + 1);
          }
        }

        var newMatrix = [];

        for (var i = 0; i < this.matrix.length; i++) {
          // there's some heavy use of JSON.stringify() and JSON.parse() here because we need to actually make copies of each variable
          // rather than passing a reference, in order to counteract JavaScript's default behavior
          var tempArray = [];
          tempArray = JSON.parse(JSON.stringify(this.matrix[i]));

          if (xCoords.includes(i)) {
            if (this.mode === 1) {
              for (var j = 0; j < yCoords.length; j++) {
                tempArray[yCoords[j]] = this.color;
              } // tempArray[pixelY] = color

            }

            if (this.mode === 0) {
              tempArray[pixelY] = '#000';
            }
          }

          newMatrix.push(JSON.parse(JSON.stringify(tempArray)));
        }

        this.matrix = newMatrix; // redraw new point on the panel if the thickness is 1

        if (this.thickness === 1) {
          var ctx = this.canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = this.matrix[pixelX][pixelY] === '#000' ? '#BABABA' : this.matrix[pixelX][pixelY];
          ctx.fillRect(pixelX * 13 + 3, pixelY * 13 + 3, 8, 8);
        } else {
          this.drawCanvas();
        }
      }
    }, {
      key: "sendDrawing",
      value: function sendDrawing() {
        var drawing = [];

        for (var i = 0; i < this.matrix.length; i++) {
          for (var j = 0; j < this.matrix[i].length; j++) {
            if (this.matrix[i][j] !== '#000') {
              var rgb = this.hexToRgb(this.matrix[i][j]);
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

        var drawingJson = {
          drawing: drawing
        }; // if drawing is empty, inform the user and cancel

        if (drawing.length < 1) {
          alert('Dessinez ou écrivez quelque chose à envoyer !');
          return false;
        }

        var req = new XMLHttpRequest();
        req.addEventListener('load', this.init());
        req.addEventListener('error', this.sendError);
        req.open('POST', "".concat(this.apiEndpoint, "/send/drawing"));
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(drawingJson));
      }
    }, {
      key: "sendMessage",
      value: function sendMessage() {
        var _this2 = this;

        var msg = this.messageBox.value;
        var msgJson = {
          text: msg
        };
        var req = new XMLHttpRequest();
        req.addEventListener('load', function () {
          _this2.messageBox.value = '';

          _this2.init();
        });
        req.addEventListener('error', this.sendError);
        req.open('POST', "".concat(this.apiEndpoint, "/send/message"));
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(msgJson));
      }
    }, {
      key: "hexToRgb",
      value: function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }
    }, {
      key: "sendError",
      value: function sendError() {
        alert('Une erreur est survenue');
      }
    }, {
      key: "send",
      value: function send() {
        if (this.messageBox !== null) {
          if (this.messageBox.value.length > 0) {
            this.sendMessage();
          } else {
            this.sendDrawing();
          }
        } else {
          this.sendDrawing();
        }
      }
    }, {
      key: "assetColorPalette",
      value: function assetColorPalette() {
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzEgLTU1MDIpIj4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjYwNDciIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwNTEiIHg9IjEiIHk9IjQ2MDMiIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxyZWN0IHdpZHRoPSI1OSIgaGVpZ2h0PSIyODQiIHg9Ii41IiB5PSIuNSIgZmlsbD0iI0U1RTZFOCIgc3Ryb2tlPSIjNTk2MjcwIiBzdHJva2Utb3BhY2l0eT0iLjM2NyIvPgogICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCAyMzUpIj4KICAgICAgICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4KICAgICAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDggOCkiPgogICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTAuNTIwODMzMzMzLDExLjk4MjM5NTggQzAuNTIwODMzMzMzLDQuMzQzODU0MTcgNi4yNSwwLjUyNDA2MjUgMTEuOTc5MTY2NywwLjUyNDA2MjUgQzE4LjY2MzU0MTcsMC41MjQwNjI1IDIzLjQzNzUsNi4yNTMyMjkxNyAyMy40Mzc1LDEwLjA3MzAyMDggQzIzLjQzNzUsMTMuODkxNzcwOCAyMS41MjgxMjUsMTQuODQ2OTc5MiAxOC42NjM1NDE3LDE0Ljg0Njk3OTIgQzE1Ljc5ODk1ODMsMTQuODQ2OTc5MiAxNC44NDM3NSwxNi43NTYzNTQyIDE0Ljg0Mzc1LDE5LjYyMDkzNzUgQzE0Ljg0Mzc1LDIyLjQ4NTUyMDggMTIuOTM0Mzc1LDIzLjQ0MDcyOTIgMTEuMDIzOTU4MywyMy40NDA3MjkyIEM3LjIwNTIwODMzLDIzLjQ0MDcyOTIgMC41MjA4MzMzMzMsMTkuNjIwOTM3NSAwLjUyMDgzMzMzMywxMS45ODIzOTU4Ii8+CiAgICAgICAgICA8cGF0aCBmaWxsPSIjNENEOTY0IiBkPSJNMTEuOTc5MTY2NywxOC43NTMyMjkyIEMxMS45NzkxNjY3LDE5LjYxNTcyOTIgMTEuMjgwMjA4MywyMC4zMTU3MjkyIDEwLjQxNjY2NjcsMjAuMzE1NzI5MiBDOS41NTMxMjUsMjAuMzE1NzI5MiA4Ljg1NDE2NjY3LDE5LjYxNTcyOTIgOC44NTQxNjY2NywxOC43NTMyMjkyIEM4Ljg1NDE2NjY3LDE3Ljg5MDcyOTIgOS41NTMxMjUsMTcuMTkwNzI5MiAxMC40MTY2NjY3LDE3LjE5MDcyOTIgQzExLjI4MDIwODMsMTcuMTkwNzI5MiAxMS45NzkxNjY3LDE3Ljg5MDcyOTIgMTEuOTc5MTY2NywxOC43NTMyMjkyIi8+CiAgICAgICAgICA8cGF0aCBmaWxsPSIjMzM5RUZGIiBkPSJNNy44MTI1LDE0LjU4NjU2MjUgQzcuODEyNSwxNS40NDkwNjI1IDcuMTEzNTQxNjcsMTYuMTQ5MDYyNSA2LjI1LDE2LjE0OTA2MjUgQzUuMzg2NDU4MzMsMTYuMTQ5MDYyNSA0LjY4NzUsMTUuNDQ5MDYyNSA0LjY4NzUsMTQuNTg2NTYyNSBDNC42ODc1LDEzLjcyNDA2MjUgNS4zODY0NTgzMywxMy4wMjQwNjI1IDYuMjUsMTMuMDI0MDYyNSBDNy4xMTM1NDE2NywxMy4wMjQwNjI1IDcuODEyNSwxMy43MjQwNjI1IDcuODEyNSwxNC41ODY1NjI1Ii8+CiAgICAgICAgICA8cGF0aCBmaWxsPSIjRkMwIiBkPSJNNy44MTI1LDguODU3Mzk1ODMgQzcuODEyNSwxMC4wMDczOTU4IDYuODc5MTY2NjcsMTAuOTQwNzI5MiA1LjcyOTE2NjY3LDEwLjk0MDcyOTIgQzQuNTc5MTY2NjcsMTAuOTQwNzI5MiAzLjY0NTgzMzMzLDEwLjAwNzM5NTggMy42NDU4MzMzMyw4Ljg1NzM5NTgzIEMzLjY0NTgzMzMzLDcuNzA3Mzk1ODMgNC41NzkxNjY2Nyw2Ljc3NDA2MjUgNS43MjkxNjY2Nyw2Ljc3NDA2MjUgQzYuODc5MTY2NjcsNi43NzQwNjI1IDcuODEyNSw3LjcwNzM5NTgzIDcuODEyNSw4Ljg1NzM5NTgzIi8+CiAgICAgICAgICA8cGF0aCBmaWxsPSIjRkYyQzU1IiBkPSJNMTQuMDYyNSw1LjczMjM5NTgzIEMxNC4wNjI1LDYuODgyMzk1ODMgMTMuMTI5MTY2Nyw3LjgxNTcyOTE3IDExLjk3OTE2NjcsNy44MTU3MjkxNyBDMTAuODI5MTY2Nyw3LjgxNTcyOTE3IDkuODk1ODMzMzMsNi44ODIzOTU4MyA5Ljg5NTgzMzMzLDUuNzMyMzk1ODMgQzkuODk1ODMzMzMsNC41ODIzOTU4MyAxMC44MjkxNjY3LDMuNjQ5MDYyNSAxMS45NzkxNjY3LDMuNjQ5MDYyNSBDMTMuMTI5MTY2NywzLjY0OTA2MjUgMTQuMDYyNSw0LjU4MjM5NTgzIDE0LjA2MjUsNS43MzIzOTU4MyIvPgogICAgICAgICAgPHBhdGggZmlsbD0iIzdGMkVGRiIgZD0iTTIwLjMxMjUsOC44NTczOTU4MyBDMjAuMzEyNSwxMC4wMDczOTU4IDE5LjM3OTE2NjcsMTAuOTQwNzI5MiAxOC4yMjkxNjY3LDEwLjk0MDcyOTIgQzE3LjA3OTE2NjcsMTAuOTQwNzI5MiAxNi4xNDU4MzMzLDEwLjAwNzM5NTggMTYuMTQ1ODMzMyw4Ljg1NzM5NTgzIEMxNi4xNDU4MzMzLDcuNzA3Mzk1ODMgMTcuMDc5MTY2Nyw2Ljc3NDA2MjUgMTguMjI5MTY2Nyw2Ljc3NDA2MjUgQzE5LjM3OTE2NjcsNi43NzQwNjI1IDIwLjMxMjUsNy43MDczOTU4MyAyMC4zMTI1LDguODU3Mzk1ODMiLz4KICAgICAgICAgIDxwYXRoIGZpbGw9IiMyRDM0NkEiIGQ9Ik0xOS43OTE2NjY3LDguODU3Mzk1ODMgQzE5Ljc5MTY2NjcsOS43MTg4NTQxNyAxOS4wOTA2MjUsMTAuNDE5ODk1OCAxOC4yMjkxNjY3LDEwLjQxOTg5NTggQzE3LjM2NzcwODMsMTAuNDE5ODk1OCAxNi42NjY2NjY3LDkuNzE4ODU0MTcgMTYuNjY2NjY2Nyw4Ljg1NzM5NTgzIEMxNi42NjY2NjY3LDcuOTk1OTM3NSAxNy4zNjc3MDgzLDcuMjk0ODk1ODMgMTguMjI5MTY2Nyw3LjI5NDg5NTgzIEMxOS4wOTA2MjUsNy4yOTQ4OTU4MyAxOS43OTE2NjY3LDcuOTk1OTM3NSAxOS43OTE2NjY3LDguODU3Mzk1ODMgTTE1LjYyNSw4Ljg1NzM5NTgzIEMxNS42MjUsMTAuMjkzODU0MiAxNi43OTM3NSwxMS40NjE1NjI1IDE4LjIyOTE2NjcsMTEuNDYxNTYyNSBDMTkuNjY0NTgzMywxMS40NjE1NjI1IDIwLjgzMzMzMzMsMTAuMjkzODU0MiAyMC44MzMzMzMzLDguODU3Mzk1ODMgQzIwLjgzMzMzMzMsNy40MjA5Mzc1IDE5LjY2NDU4MzMsNi4yNTMyMjkxNyAxOC4yMjkxNjY3LDYuMjUzMjI5MTcgQzE2Ljc5Mzc1LDYuMjUzMjI5MTcgMTUuNjI1LDcuNDIwOTM3NSAxNS42MjUsOC44NTczOTU4MyBNMTEuOTc5MTY2Nyw3LjI5NDg5NTgzIEMxMS4xMTc3MDgzLDcuMjk0ODk1ODMgMTAuNDE2NjY2Nyw2LjU5Mzg1NDE3IDEwLjQxNjY2NjcsNS43MzIzOTU4MyBDMTAuNDE2NjY2Nyw0Ljg3MDkzNzUgMTEuMTE3NzA4Myw0LjE2OTg5NTgzIDExLjk3OTE2NjcsNC4xNjk4OTU4MyBDMTIuODQwNjI1LDQuMTY5ODk1ODMgMTMuNTQxNjY2Nyw0Ljg3MDkzNzUgMTMuNTQxNjY2Nyw1LjczMjM5NTgzIEMxMy41NDE2NjY3LDYuNTkzODU0MTcgMTIuODQwNjI1LDcuMjk0ODk1ODMgMTEuOTc5MTY2Nyw3LjI5NDg5NTgzIE0xMS45NzkxNjY3LDMuMTI4MjI5MTcgQzEwLjU0Mzc1LDMuMTI4MjI5MTcgOS4zNzUsNC4yOTU5Mzc1IDkuMzc1LDUuNzMyMzk1ODMgQzkuMzc1LDcuMTY4ODU0MTcgMTAuNTQzNzUsOC4zMzY1NjI1IDExLjk3OTE2NjcsOC4zMzY1NjI1IEMxMy40MTQ1ODMzLDguMzM2NTYyNSAxNC41ODMzMzMzLDcuMTY4ODU0MTcgMTQuNTgzMzMzMyw1LjczMjM5NTgzIEMxNC41ODMzMzMzLDQuMjk1OTM3NSAxMy40MTQ1ODMzLDMuMTI4MjI5MTcgMTEuOTc5MTY2NywzLjEyODIyOTE3IE00LjE2NjY2NjY3LDguODU3Mzk1ODMgQzQuMTY2NjY2NjcsNy45OTU5Mzc1IDQuODY3NzA4MzMsNy4yOTQ4OTU4MyA1LjcyOTE2NjY3LDcuMjk0ODk1ODMgQzYuNTkwNjI1LDcuMjk0ODk1ODMgNy4yOTE2NjY2Nyw3Ljk5NTkzNzUgNy4yOTE2NjY2Nyw4Ljg1NzM5NTgzIEM3LjI5MTY2NjY3LDkuNzE4ODU0MTcgNi41OTA2MjUsMTAuNDE5ODk1OCA1LjcyOTE2NjY3LDEwLjQxOTg5NTggQzQuODY3NzA4MzMsMTAuNDE5ODk1OCA0LjE2NjY2NjY3LDkuNzE4ODU0MTcgNC4xNjY2NjY2Nyw4Ljg1NzM5NTgzIE04LjMzMzMzMzMzLDguODU3Mzk1ODMgQzguMzMzMzMzMzMsNy40MjA5Mzc1IDcuMTY0NTgzMzMsNi4yNTMyMjkxNyA1LjcyOTE2NjY3LDYuMjUzMjI5MTcgQzQuMjkzNzUsNi4yNTMyMjkxNyAzLjEyNSw3LjQyMDkzNzUgMy4xMjUsOC44NTczOTU4MyBDMy4xMjUsMTAuMjkzODU0MiA0LjI5Mzc1LDExLjQ2MTU2MjUgNS43MjkxNjY2NywxMS40NjE1NjI1IEM3LjE2NDU4MzMzLDExLjQ2MTU2MjUgOC4zMzMzMzMzMywxMC4yOTM4NTQyIDguMzMzMzMzMzMsOC44NTczOTU4MyBNNi4yNSwxNS42MjgyMjkyIEM1LjY3NjA0MTY3LDE1LjYyODIyOTIgNS4yMDgzMzMzMywxNS4xNjE1NjI1IDUuMjA4MzMzMzMsMTQuNTg2NTYyNSBDNS4yMDgzMzMzMywxNC4wMTE1NjI1IDUuNjc2MDQxNjcsMTMuNTQ0ODk1OCA2LjI1LDEzLjU0NDg5NTggQzYuODIzOTU4MzMsMTMuNTQ0ODk1OCA3LjI5MTY2NjY3LDE0LjAxMTU2MjUgNy4yOTE2NjY2NywxNC41ODY1NjI1IEM3LjI5MTY2NjY3LDE1LjE2MTU2MjUgNi44MjM5NTgzMywxNS42MjgyMjkyIDYuMjUsMTUuNjI4MjI5MiBNNi4yNSwxMi41MDMyMjkyIEM1LjEwMTA0MTY3LDEyLjUwMzIyOTIgNC4xNjY2NjY2NywxMy40Mzc2MDQyIDQuMTY2NjY2NjcsMTQuNTg2NTYyNSBDNC4xNjY2NjY2NywxNS43MzU1MjA4IDUuMTAxMDQxNjcsMTYuNjY5ODk1OCA2LjI1LDE2LjY2OTg5NTggQzcuMzk4OTU4MzMsMTYuNjY5ODk1OCA4LjMzMzMzMzMzLDE1LjczNTUyMDggOC4zMzMzMzMzMywxNC41ODY1NjI1IEM4LjMzMzMzMzMzLDEzLjQzNzYwNDIgNy4zOTg5NTgzMywxMi41MDMyMjkyIDYuMjUsMTIuNTAzMjI5MiBNMTAuNDE2NjY2NywxOS43OTQ4OTU4IEM5Ljg0MjcwODMzLDE5Ljc5NDg5NTggOS4zNzUsMTkuMzI4MjI5MiA5LjM3NSwxOC43NTMyMjkyIEM5LjM3NSwxOC4xNzgyMjkyIDkuODQyNzA4MzMsMTcuNzExNTYyNSAxMC40MTY2NjY3LDE3LjcxMTU2MjUgQzEwLjk5MDYyNSwxNy43MTE1NjI1IDExLjQ1ODMzMzMsMTguMTc4MjI5MiAxMS40NTgzMzMzLDE4Ljc1MzIyOTIgQzExLjQ1ODMzMzMsMTkuMzI4MjI5MiAxMC45OTA2MjUsMTkuNzk0ODk1OCAxMC40MTY2NjY3LDE5Ljc5NDg5NTggTTEwLjQxNjY2NjcsMTYuNjY5ODk1OCBDOS4yNjc3MDgzMywxNi42Njk4OTU4IDguMzMzMzMzMzMsMTcuNjA0MjcwOCA4LjMzMzMzMzMzLDE4Ljc1MzIyOTIgQzguMzMzMzMzMzMsMTkuOTAyMTg3NSA5LjI2NzcwODMzLDIwLjgzNjU2MjUgMTAuNDE2NjY2NywyMC44MzY1NjI1IEMxMS41NjU2MjUsMjAuODM2NTYyNSAxMi41LDE5LjkwMjE4NzUgMTIuNSwxOC43NTMyMjkyIEMxMi41LDE3LjYwNDI3MDggMTEuNTY1NjI1LDE2LjY2OTg5NTggMTAuNDE2NjY2NywxNi42Njk4OTU4IE0xOC42NjM1NDE3LDE0LjMyNjE0NTggQzE1Ljc4MzMzMzMsMTQuMzI2MTQ1OCAxNC4zMjI5MTY3LDE2LjEwNzM5NTggMTQuMzIyOTE2NywxOS42MjA5Mzc1IEMxNC4zMjI5MTY3LDIyLjQ5MTc3MDggMTIuMjU2MjUsMjIuOTE5ODk1OCAxMS4wMjM5NTgzLDIyLjkxOTg5NTggQzcuNDQxNjY2NjcsMjIuOTE5ODk1OCAxLjA0MTY2NjY3LDE5LjI2NDY4NzUgMS4wNDE2NjY2NywxMS45ODIzOTU4IEMxLjA0MTY2NjY3LDQuNDY3ODEyNSA2LjcxMTQ1ODMzLDEuMDQ0ODk1ODMgMTEuOTc5MTY2NywxLjA0NDg5NTgzIEMxOC4zMjM5NTgzLDEuMDQ0ODk1ODMgMjIuOTE2NjY2Nyw2LjQzNzYwNDE3IDIyLjkxNjY2NjcsMTAuMDczMDIwOCBDMjIuOTE2NjY2NywxMy42MDMyMjkyIDIxLjIxNjY2NjcsMTQuMzI2MTQ1OCAxOC42NjM1NDE3LDE0LjMyNjE0NTggTTExLjk3OTE2NjcsMC4wMDMyMjkxNjY2NyBDNi4yMDkzNzUsMC4wMDMyMjkxNjY2NyAwLDMuNzUyMTg3NSAwLDExLjk4MjM5NTggQzAsMTkuOTU4NDM3NSA3LjA2NzcwODMzLDIzLjk2MTU2MjUgMTEuMDIzOTU4MywyMy45NjE1NjI1IEMxMy43NDE2NjY3LDIzLjk2MTU2MjUgMTUuMzY0NTgzMywyMi4zMzg2NDU4IDE1LjM2NDU4MzMsMTkuNjIwOTM3NSBDMTUuMzY0NTgzMywxNi42NzkyNzA4IDE2LjM4MjI5MTcsMTUuMzY3ODEyNSAxOC42NjM1NDE3LDE1LjM2NzgxMjUgQzIxLjEyODEyNSwxNS4zNjc4MTI1IDIzLjk1ODMzMzMsMTQuNzY1NzI5MiAyMy45NTgzMzMzLDEwLjA3MzAyMDggQzIzLjk1ODMzMzMsNi4wMTc4MTI1IDE4LjkyODEyNSwwLjAwMzIyOTE2NjY3IDExLjk3OTE2NjcsMC4wMDMyMjkxNjY2NyIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==';
      }
    }, {
      key: "assetPencil",
      value: function assetPencil() {
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNyIgaGVpZ2h0PSIyNyIgdmlld0JveD0iMCAwIDI3IDI3Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzcgLTUyODUpIj4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcgMTkpIj4KICAgICAgICA8cG9seWdvbiBmaWxsPSIjMkQzNDZBIiBwb2ludHM9IjQuNTUxIDIzLjMwMSAwIDI1IDEuNjkzIDIwLjQ0OSAxLjcwNSAyMC40NTUgNC41NDUgMjMuMjk1Ii8+CiAgICAgICAgPHBvbHlnb24gZmlsbD0iI0ZGRiIgcG9pbnRzPSI3LjAyOCAxNy45NzIgMTAuMjM5IDIxLjE4MiA0LjU1MSAyMy4zMDEgNC41NDUgMjMuMjk1IDEuNzA1IDIwLjQ1NSAxLjY5MyAyMC40NDkgMy44MTggMTQuNzU2Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGQzEyRSIgZD0iTTIyLjIyMTU5MDksOS4xOTg4NjM2NCBMMTAuMjI3MjcyNywyMS4xODE4MTgyIEw3LjAxNzA0NTQ1LDE3Ljk3MTU5MDkgTDIxLjAyMjcyNzMsMy45NzcyNzI3MyBMMjQuMjA0NTQ1NSw3LjE1OTA5MDkxIEMyNC4xMDM5MjA0LDcuMjk3MTE5MjUgMjMuOTkxNzc2NSw3LjQyNjM2OTggMjMuODY5MzE4Miw3LjU0NTQ1NDU1IEwyMi4yMjcyNzI3LDkuMjA0NTQ1NDUgTDIyLjIyMTU5MDksOS4xOTg4NjM2NCBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGQzEyRSIgZD0iTTE1LjgwMTEzNjQsMi43Nzg0MDkwOSBMMTcuNDY1OTA5MSwxLjEzNjM2MzY0IEMxNy41ODY5NDk0LDEuMDEzODE0NjQgMTcuNzE4MDk0NiwwLjkwMTY3NjAyMSAxNy44NTc5NTQ1LDAuODAxMTM2MzY0IEwyMS4wMjI3MjczLDMuOTc3MjcyNzMgTDcuMDI4NDA5MDksMTcuOTcxNTkwOSBMMy44MTgxODE4MiwxNC43NzI3MjczIEwxNS44MDExMzY0LDIuNzc4NDA5MDkgWiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNDM0NDRTkiIGQ9Ik0yNSw0Ljc3ODQwOTA5IEMyNS4wMDgyNDY0LDUuNjI5NjU0NTcgMjQuNzM2NzY3Miw2LjQ2MDA2MTQxIDI0LjIyNzI3MjcsNy4xNDIwNDU0NSBMMjEuMDIyNzI3MywzLjk3NzI3MjczIEwxNy44NTc5NTQ1LDAuNzcyNzI3MjczIEMxOS40NzcyNzI3LC0wLjQ1NDU0NTQ1NSAyMS45MzE4MTgyLC0wLjIwNDU0NTQ1NSAyMy41Mzk3NzI3LDEuNDMxODE4MTggQzI0LjQ1MTM3MzMsMi4zMDkzNDI3NSAyNC45NzY2OTU3LDMuNTEzMjkxNzggMjUsNC43Nzg0MDkwOSBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTE1LjU4NzA1ODgsMi4xOTQ2MzgwOCBDMTUuODA5MDUxMywxLjk3Mjg1Mjk0IDE2LjE2ODgwNCwxLjk3MzAyMDk3IDE2LjM5MDU4OTIsMi4xOTUwMTMzOSBDMTYuNTk1MzEzOSwyLjM5OTkyOTQ3IDE2LjYxMDkxODgsMi43MjIyMjcxNiAxNi40Mzc1MDUxLDIuOTQ1MDM4OTIgTDE2LjM5MDIxMzksMi45OTg1NDM3MyBMNC42MjE1OTA5MSwxNC43NTU2ODE4IEwxMC4yMzg2MzY0LDIwLjM3Nzg0MDkgTDIyLjAwMTU1MDEsOC42MDk2OTIyNCBDMjIuMjA2MzIyNyw4LjQwNDgyMzk5IDIyLjUyODYwOTQsOC4zODg5OTMzMiAyMi43NTE1NDI2LDguNTYyMjUwODcgTDIyLjgwNTA4MDUsOC42MDk1MDQ2MyBDMjMuMDA5OTQ4Nyw4LjgxNDI3NzIzIDIzLjAyNTc3OTQsOS4xMzY1NjM5MiAyMi44NTI1MjE5LDkuMzU5NDk3MTEgTDIyLjgwNTI2ODEsOS40MTMwMzUwNCBMMTAuNjQwNDk1NCwyMS41ODM0ODk2IEMxMC40MzU2MjQ5LDIxLjc4ODQ1NTcgMTAuMTEzMTUyMiwyMS44MDQxOTAzIDkuODkwMjI1NjEsMjEuNjMwNzE2MSBMOS44MzY2OTM0OSwyMS41ODM0MDU3IEwzLjQxNjIzODk1LDE1LjE1NzI2OTMgQzMuMjExNTA1NTMsMTQuOTUyMzU0NyAzLjE5NTg5NjE5LDE0LjYzMDA1MDYgMy4zNjkzMTIzLDE0LjQwNzIzNDggTDMuNDE2NjA0MywxNC4zNTM3MjkgTDE1LjU4NzA1ODgsMi4xOTQ2MzgwOCBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTE3LjA2NDE0MzkuNzM0NTk4NDJDMTguODkxODgyNi0xLjA5MzE0MDM0IDIxLjk4MzM1NTctLjkyODEyOTIzNiAyMy45Njk5NDcgMS4wNTg0NjIwNiAyNS45MTY4ODI5IDMuMDA1Mzk3OTYgMjYuMTE0NDI3NyA2LjAxMzkwMDIzIDI0LjM5OTE0NjYgNy44NDk3MzE4MkwyNC4yOTE3MzggNy45NjA2NDU0NSAyMi42MjY5NjUyIDkuNjA4MzcyNzNDMjIuNDAzOTM3NiA5LjgyOTExNjgxIDIyLjA0NDE4OTUgOS44MjcyNjU2MiAyMS44MjM0NDU1IDkuNjA0MjM3OTggMjEuNjE5NjgxNyA5LjM5ODM2NjMxIDIxLjYwNTU4NDkgOS4wNzU5OTkxMyAyMS43ODAwMzkxIDguODU0MDAxMTVMMjEuODI3NTgwMiA4LjgwMDcxODE4IDIzLjQ5MDk5NyA3LjE1NDMzNzQ1QzI0Ljg1Mzg0MDggNS43OTYzNDM2NSAyNC43MjcwNTk3IDMuNDIyNjM1NjMgMjMuMTY2NDE2NiAxLjg2MTk5MjQ5IDIxLjY0MTg5NDUuMzM3NDcwMzk3IDE5LjM0MTM0ODQuMTgxMTE0Mzc0IDE3Ljk2MTg0OTkgMS40NDc5Njk3M0wxNy44NjQ5MDM2IDEuNTQwODgwNTcgMTYuMjAwMTMwOSAzLjE4MjkyNjAzQzE1Ljk3NjcyMjMgMy40MDMyODQ2MiAxNS42MTY5NzggMy40MDA4MTIxNSAxNS4zOTY2MTk0IDMuMTc3NDAzNjEgMTUuMTkzMjExNSAyLjk3MTE4MDM1IDE1LjE3OTY3MTUgMi42NDg3ODkzMSAxNS4zNTQ1MDg4IDIuNDI3MDkyOTRMMTUuNDAyMTQxOCAyLjM3Mzg5MjE2IDE3LjA2NDE0MzkuNzM0NTk4NDJ6TTMuMjg1Nzc3MjIgMTQuNTU3MjQ4MkMzLjM5NTM2OTEgMTQuMjYzMjA5MiAzLjcyMjU3NjU0IDE0LjExMzY4NTMgNC4wMTY2MTU0OCAxNC4yMjMyNzcyIDQuMjg5NjUxNjQgMTQuMzI1MDQxMSA0LjQzODA4MDQzIDE0LjYxNDQ0MjkgNC4zNzAxNDYxIDE0Ljg5MDY5MDhMNC4zNTA1ODY0MiAxNC45NTQxMTU1Ljk2NjQ3NzI3MyAyNC4wMzI5NTQ1IDEwLjA0MDEwNiAyMC42NDk0NDk2QzEwLjMxMzEyMzcgMjAuNTQ3NjM2MSAxMC42MTQ3ODEzIDIwLjY2OTIzODcgMTAuNzQ0MjcwNSAyMC45MjI1MzgxTDEwLjc3MTAwNDkgMjAuOTgzMjg3OEMxMC44NzI4MTg0IDIxLjI1NjMwNTUgMTAuNzUxMjE1OCAyMS41NTc5NjMxIDEwLjQ5NzkxNjUgMjEuNjg3NDUyM0wxMC40MzcxNjY3IDIxLjcxNDE4NjcuMTk4NTMwMzM5IDI1LjUzMjM2ODZDLS4yMzc3NDMwMDcgMjUuNjk1MDYzMi0uNjYzNzA4NzM0IDI1LjI5NTIxMzQtLjU1MTE0MjIwMiAyNC44NjA5NDgxTC0uNTMyNDA0NjAyIDI0LjgwMTU2NjMgMy4yODU3NzcyMiAxNC41NTcyNDgyeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyRDM0NkEiIGQ9Ik0xLjMwMjc4MDI0LDIwLjA1Mjc4MDIgQzEuNTA3NjAwNjcsMTkuODQ3OTU5OCAxLjgyOTg5MTA0LDE5LjgzMjIwNDQgMi4wNTI3ODM3NywyMC4wMDU1MTQgTDIuMTA2MzEwNjcsMjAuMDUyNzgwMiBMNC45NDcyMTk3NiwyMi44OTM2ODkzIEM1LjE2OTEwODU2LDIzLjExNTU3ODEgNS4xNjkxMDg1NiwyMy40NzUzMzEgNC45NDcyMTk3NiwyMy42OTcyMTk4IEM0Ljc0MjM5OTMzLDIzLjkwMjA0MDIgNC40MjAxMDg5NiwyMy45MTc3OTU2IDQuMTk3MjE2MjMsMjMuNzQ0NDg2IEw0LjE0MzY4OTMzLDIzLjY5NzIxOTggTDEuMzAyNzgwMjQsMjAuODU2MzEwNyBDMS4wODA4OTE0NCwyMC42MzQ0MjE5IDEuMDgwODkxNDQsMjAuMjc0NjY5IDEuMzAyNzgwMjQsMjAuMDUyNzgwMiBaIi8+CiAgICAgICAgPHBvbHlnb24gZmlsbD0iIzJEMzQ2QSIgcG9pbnRzPSIxOC4yNiAuMzcxIDI0LjY1MiA2Ljc2MyAyMy44NDggNy41NjcgMTcuNDU2IDEuMTc0Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTIwLjY0Mzc3MDgsMy41NTgzODA2MiBDMjAuODY1NzA0NiwzLjMzNjUzNjggMjEuMjI1NDU3NCwzLjMzNjYwOTczIDIxLjQ0NzMwMTIsMy41NTg1NDM1MSBDMjEuNjUyMDgwMSwzLjc2MzQwNTQ2IDIxLjY2Nzc3MDIsNC4wODU2OTkwMiAyMS40OTQ0MTU0LDQuMzA4NTU2NjEgTDIxLjQ0NzEzODMsNC4zNjIwNzM5MyBMNy40MzAwOTI4NSwxOC4zNzM0Mzc2IEM3LjIwODE1OTA4LDE4LjU5NTI4MTQgNi44NDg0MDYyNiwxOC41OTUyMDg1IDYuNjI2NTYyNDQsMTguMzczMjc0NyBDNi40MjE3ODM1MywxOC4xNjg0MTI3IDYuNDA2MDkzNDUsMTcuODQ2MTE5MiA2LjU3OTQ0ODIyLDE3LjYyMzI2MTYgTDYuNjI2NzI1MzMsMTcuNTY5NzQ0MyBMMjAuNjQzNzcwOCwzLjU1ODM4MDYyIFoiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==';
      }
    }, {
      key: "assetEraser",
      value: function assetEraser() {
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzEgLTU1MDIpIj4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjYwNDciIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwNTEiIHg9IjEiIHk9IjQ2MDMiIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxyZWN0IHdpZHRoPSI1OSIgaGVpZ2h0PSIyODQiIHg9Ii41IiB5PSIuNSIgZmlsbD0iI0U1RTZFOCIgc3Ryb2tlPSIjNTk2MjcwIiBzdHJva2Utb3BhY2l0eT0iLjM2NyIvPgogICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCAyMzUpIj4KICAgICAgICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4KICAgICAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcgOCkiPgogICAgICAgICAgPHBhdGggZmlsbD0iI0ZGMkM1NSIgZD0iTTQuOTgsMTIuOTgzNiBMMC45MTcsMTcuMTg2NiBDMC4zNjEsMTcuNzYwNiAwLjM2MSwxOC42ODk2IDAuOTE3LDE5LjI2MzYgTDQuMDQ4LDIyLjUwMzYgTDkuOTU2LDIyLjUwMzYgTDEyLjE4OSwyMC4xOTI2IEw0Ljk4LDEyLjk4MzYgWiIvPgogICAgICAgICAgPHBvbHlnb24gZmlsbD0iI0ZDMCIgcG9pbnRzPSIxNi41IC41MDMgMjQuNSA4LjUwMyAxMi41IDIwLjUwMyA0LjUgMTIuNTAzIi8+CiAgICAgICAgICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTIuNSwxOS43OTYxIEw1LjIwNywxMi41MDMxIEwxNi41LDEuMjEwMSBMMjMuNzkzLDguNTAzMSBMMTIuNSwxOS43OTYxIFogTTkuNzQ0LDIyLjAwMzEgTDQuMjYsMjIuMDAzMSBMMS4yNzYsMTguOTE2MSBDMC45MDgsMTguNTM1MSAwLjkwOCwxNy45MTUxIDEuMjc2LDE3LjUzNDEgTDQuOTg2LDEzLjY5NjEgTDExLjQ4OCwyMC4xOTgxIEw5Ljc0NCwyMi4wMDMxIFogTTE2Ljg1NCwwLjE1MDEgQzE2LjY1OCwtMC4wNDU5IDE2LjM0MiwtMC4wNDU5IDE2LjE0NiwwLjE1MDEgTDQuMTQ2LDEyLjE1MDEgQzMuOTUxLDEyLjM0NTEgMy45NTEsMTIuNjYxMSA0LjE0NiwxMi44NTcxIEw0LjI3OSwxMi45ODkxIEwwLjU1NywxNi44MzkxIEMtMC4xODIsMTcuNjA0MSAtMC4xODIsMTguODQ3MSAwLjU1NywxOS42MTExIEwyLjg2OSwyMi4wMDMxIEwwLjUsMjIuMDAzMSBDMC4yMjQsMjIuMDAzMSAwLDIyLjIyNzEgMCwyMi41MDMxIEMwLDIyLjc3OTEgMC4yMjQsMjMuMDAzMSAwLjUsMjMuMDAzMSBMNC4wNDgsMjMuMDAzMSBMOS45NTYsMjMuMDAzMSBMMTYuNSwyMy4wMDMxIEMxNi43NzYsMjMuMDAzMSAxNywyMi43NzkxIDE3LDIyLjUwMzEgQzE3LDIyLjIyNzEgMTYuNzc2LDIyLjAwMzEgMTYuNSwyMi4wMDMxIEwxMS4xMzQsMjIuMDAzMSBMMTIuMjA1LDIwLjg5NjEgQzEyLjI5MywyMC45NjIxIDEyLjM5NSwyMS4wMDMxIDEyLjUsMjEuMDAzMSBDMTIuNjI4LDIxLjAwMzEgMTIuNzU2LDIwLjk1NDEgMTIuODU0LDIwLjg1NzEgTDI0Ljg1NCw4Ljg1NzEgQzI1LjA0OSw4LjY2MTEgMjUuMDQ5LDguMzQ1MSAyNC44NTQsOC4xNTAxIEwxNi44NTQsMC4xNTAxIFoiLz4KICAgICAgICAgIDxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0yMy44NTM1LDcuMTQ5NiBDMjMuNjU4NSw2Ljk1NDYgMjMuMzQxNSw2Ljk1NDYgMjMuMTQ2NSw3LjE0OTYgTDExLjQ5NTUsMTguODAwNiBDMTEuNDExNSwxOC43NDE2IDExLjMxMDUsMTguNzA5NiAxMS4yMDY1LDE4LjcwOTYgQzExLjEwMTUsMTguNzA5NiAxMC45NDA1LDE4Ljc2MzYgMTAuODQ2NSwxOC44NjE2IEw5Ljc0MzUsMjAuMDAzNiBMNC4yNTk1LDIwLjAwMzYgTDEuMzA4NSwxNi45NTE2IEMxLjI5MjUsMTYuOTI3NiAxLjI3NTUsMTYuOTA0NiAxLjI1OTUsMTYuODg3NiBDMS4xNjU1LDE2Ljc4NDYgMS4wMzE1LDE2LjcyNTYgMC44OTE1LDE2LjcyNTYgTDAuODkwNSwxNi43MjU2IEMwLjc0OTUsMTYuNzI1NiAwLjYxNTUsMTYuNzg1NiAwLjUyMTUsMTYuODg5NiBDLTAuMTgzNSwxNy42Njc2IC0wLjE2NzUsMTguODYyNiAwLjU1NjUsMTkuNjExNiBMMy42ODg1LDIyLjg1MDYgQzMuNzgyNSwyMi45NDg2IDMuOTEyNSwyMy4wMDM2IDQuMDQ3NSwyMy4wMDM2IEw5Ljk1NTUsMjMuMDAzNiBDMTAuMDkwNSwyMy4wMDM2IDEwLjIyMDUsMjIuOTQ4NiAxMC4zMTQ1LDIyLjg1MDYgTDEyLjE5OTUsMjAuOTAyNiBDMTIuMzkxNSwyMS4wNDk2IDEyLjY3NDUsMjEuMDM1NiAxMi44NTM1LDIwLjg1NjYgTDI0Ljg1MzUsOC44NTY2IEMyNS4wNDg1LDguNjYxNiAyNS4wNDg1LDguMzQ0NiAyNC44NTM1LDguMTQ5NiBMMjMuODUzNSw3LjE0OTYgWiIgb3BhY2l0eT0iLjEyIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K';
      }
    }, {
      key: "assetSize",
      value: function assetSize(size) {
        switch (size) {
          case 1:
            // return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzEgLTU1MDIpIj4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjYwNDciIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwNTEiIHg9IjEiIHk9IjQ2MDMiIGZpbGw9IiNGQkZCRkEiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxyZWN0IHdpZHRoPSI1OSIgaGVpZ2h0PSIyODQiIHg9Ii41IiB5PSIuNSIgZmlsbD0iI0U1RTZFOCIgc3Ryb2tlPSIjNTk2MjcwIiBzdHJva2Utb3BhY2l0eT0iLjM2NyIgaWQ9InNtYWxsU3Ryb2tlIi8+CiAgICAgIDxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAgMjM1KSIvPgogICAgICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIyNiIgeT0iMjUyIiBmaWxsPSIjNTk2MjcwIiBpZD0ic21hbGxGaWxsIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" id=\"size1\" class=\"toolSelected\"><g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(-231 -5502)\"><rect width=\"1440\" height=\"6047\" fill=\"#FBFBFA\"/><rect width=\"1440\" height=\"1051\" x=\"1\" y=\"4603\" fill=\"#FBFBFA\"/><g transform=\"translate(221 5267)\"><rect width=\"59\" height=\"284\" x=\".5\" y=\".5\" fill=\"#E5E6E8\" stroke=\"#596270\" stroke-opacity=\".367\" id=\"smallStroke\"/><rect width=\"40\" height=\"40\" transform=\"translate(10 235)\"/><rect width=\"7\" height=\"7\" x=\"26\" y=\"252\" fill=\"#596270\" id=\"smallFill\"/></g></g></svg>";

          case 2:
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" id=\"size2\"><g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(-231 -5502)\"><rect width=\"1440\" height=\"6047\" fill=\"#FBFBFA\"/><rect width=\"1440\" height=\"1051\" x=\"1\" y=\"4603\" fill=\"#FBFBFA\"/><g transform=\"translate(221 5267)\"><rect width=\"59\" height=\"284\" x=\".5\" y=\".5\" fill=\"#E5E6E8\" stroke=\"#596270\" stroke-opacity=\".367\" id=\"mediumStroke\"/><rect width=\"40\" height=\"40\" transform=\"translate(10 235)\"/><rect width=\"12\" height=\"12\" x=\"24\" y=\"250\" fill=\"#596270\" id=\"mediumFill\"/></g></g></svg>";

          case 3:
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" id=\"size3\"><g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(-231 -5502)\"><rect width=\"1440\" height=\"6047\" fill=\"#FBFBFA\"/><rect width=\"1440\" height=\"1051\" x=\"1\" y=\"4603\" fill=\"#FBFBFA\"/><g transform=\"translate(221 5267)\"><rect width=\"59\" height=\"284\" x=\".5\" y=\".5\" fill=\"#E5E6E8\" stroke=\"#596270\" stroke-opacity=\".367\" id=\"largeStroke\"/><rect width=\"40\" height=\"40\" transform=\"translate(10 235)\"/><rect width=\"20\" height=\"20\" x=\"20\" y=\"246\" fill=\"#596270\" id=\"largeFill\"/></g></g></svg>";

          default:
            return null;
        }
      }
    }]);

    return WebupRgbPanel;
  }();

  return WebupRgbPanel;

})));
