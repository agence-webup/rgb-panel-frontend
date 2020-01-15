/*!
 * WebupRGBPannel v1.0.0
 * (c) 2016-2020 Agence Webup
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.WebupRGBPannel = factory());
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

  var WebupRgbPannel =
  /*#__PURE__*/
  function () {
    function WebupRgbPannel(panelId, toolsId, widthValue, heightValue, endpoint) {
      var _this = this;

      _classCallCheck(this, WebupRgbPannel);

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
      var toolsMarkup = "\n    <a>\n      <img id=\"pencil\" src=\"".concat(this.assetPencil(), "\" alt=\"pencil\">\n      <span>\n        <input type=\"range\" id=\"thickness\" min=\"1\" max=\"3\" step=\"1\">\n      </span>\n    </a>\n    <a>\n      <img src=\"").concat(this.assetEraser(), "\" alt=\"eraser\" id=\"eraser\">\n    </a>\n    <span id=\"colorWrapper\">\n      <input type=\"color\" id=\"colorInput\" value=\"#00F\">\n      <span id=\"color\"></span>\n    </span>\n    ");
      this.tools.insertAdjacentHTML('afterbegin', toolsMarkup);
      this.messageBox = document.getElementById('message');
      this.pencilButton = document.getElementById('pencil');
      this.eraserButton = document.getElementById('eraser');
      this.colorInput = document.getElementById('colorInput');
      this.colorPreview = document.getElementById('color');
      this.thicknessControl = document.getElementById('thickness');
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
        if (_this.mouseDown == true) {
          var canvasWidth = panel.getBoundingClientRect().width;
          var imageWidth = _this.matrix.length * 13;
          var ratio = imageWidth / canvasWidth;
          var mouseX = (e.pageX - _this.canvas.offsetLeft) * ratio;
          var mouseY = (e.pageY - _this.canvas.offsetTop) * ratio;

          _this.drawOnCanvas(mouseX, mouseY, color);
        }
      });
      this.canvas.addEventListener('touchmove', function (e) {
        if (tihs.mouseDown == true) {
          e.preventDefault();

          var canvasWidth = _this.panel.getBoundingClientRect().width;

          var imageWidth = _this.matrix.length * 13;
          var ratio = imageWidth / canvasWidth;
          var mouseX = (e.pageX - canvas.offsetLeft) * ratio;
          var mouseY = (e.pageY - canvas.offsetTop) * ratio;

          _this.drawOnCanvas(x = mouseX, y = mouseY, color = color);
        }
      });
      this.colorPreview.addEventListener('click', function () {
        colorInput.value = color;
      });
      this.colorInput.addEventListener('change', function () {
        // Immediately set mode to draw when color is picked
        this.mode = 1;
        this.color = colorInput.value;
        this.colorPreview.style.backgroundColor = this.color;
      });
      this.thicknessControl.addEventListener('change', function () {
        var chosenThickness = this.thicknessControl.value; // Because `<input type="range">` can't be set to have the exact scale we want, lo and behold: clunky code below

        switch (chosenThickness) {
          case '1':
            // single dot
            thickness = 1;
            break;

          case '2':
            // 2x2 square
            thickness = 2;
            break;

          case '3':
            // 3x3 square
            thickness = 3;
            break;
        }
      });

      this.pencilButton.onclick = function (event) {
        if (_this.mode != 1) {
          _this.mode = 1;

          if (_this.eraserButton.classList.contains('toolSelected')) {
            _this.eraserButton.classList.remove('toolSelected');
          }

          _this.pencilButton.classList.add('toolSelected');
        }
      };

      this.eraserButton.onclick = function (event) {
        if (_this.mode != 0) {
          _this.mode = 0;

          if (_this.pencilButton.classList.contains('toolSelected')) {
            _this.pencilButton.classList.remove('toolSelected');
          }

          _this.eraserButton.classList.add('toolSelected');
        }
      };
    }

    _createClass(WebupRgbPannel, [{
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
      }
    }, {
      key: "drawCanvas",
      value: function drawCanvas() {
        if (this.canvas.getContext) {
          var ctx = this.canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.lineWidth = 1; // start with x = y = 0
          // these are used as coordinates for drawing each "pixel"

          var _x = 0;
          var _y = 0; // start with x2 = y2 = 3
          // as x and y above, but for the inner square, which actually displays the color

          var x2 = 3;
          var y2 = 3; // loop through rows and draw them

          for (var i = 0; i < this.matrix.length; i++) {
            // loop again through items in row, draw them
            for (var j = 0; j < this.matrix[i].length; j++) {
              ctx.strokeStyle = '#909090';
              ctx.strokeRect(_x, _y, 13, 13);
              ctx.fillStyle = '#777777';
              ctx.fillRect(_x + 1, _y + 1, 12, 12);
              ctx.fillStyle = this.matrix[i][j] == '#000' ? '#BABABA' : this.matrix[i][j];
              ctx.fillRect(x2, y2, 8, 8); // bump up x coordinates for next iteration

              _y += 13;
              y2 += 13;
            } // reinitialize coordinates for next line


            _x += 13;
            _y = 0;
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

        var newMatrix = [];

        for (var i = 0; i < this.matrix.length; i++) {
          // there's some heavy use of JSON.stringify() and JSON.parse() here because we need to actually make copies of each variable
          // rather than passing a reference, in order to counteract JavaScript's default behavior
          var tempArray = [];
          tempArray = JSON.parse(JSON.stringify(this.matrix[i]));

          if (xCoords.includes(i)) {
            if (this.mode == 1) {
              for (var j = 0; j < yCoords.length; j++) {
                tempArray[yCoords[j]] = this.color;
              } // tempArray[pixelY] = color

            }

            if (this.mode == 0) {
              tempArray[pixelY] = '#000';
            }
          }

          newMatrix.push(JSON.parse(JSON.stringify(tempArray)));
        }

        this.matrix = newMatrix; // redraw new point on the panel if the thickness is 1

        if (this.thickness == 1) {
          var ctx = this.canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = this.matrix[pixelX][pixelY] == '#000' ? '#BABABA' : this.matrix[pixelX][pixelY];
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
            if (this.matrix[i][j] != '#000') {
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
        if (this.messageBox.value.length > 0) {
          this.sendMessage();
        } else {
          this.sendDrawing();
        }
      }
    }, {
      key: "assetPencil",
      value: function assetPencil() {
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNyIgaGVpZ2h0PSIyNyIgdmlld0JveD0iMCAwIDI3IDI3Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzcgLTUyODUpIj4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcgMTkpIj4KICAgICAgICA8cG9seWdvbiBmaWxsPSIjMkQzNDZBIiBwb2ludHM9IjQuNTUxIDIzLjMwMSAwIDI1IDEuNjkzIDIwLjQ0OSAxLjcwNSAyMC40NTUgNC41NDUgMjMuMjk1Ii8+CiAgICAgICAgPHBvbHlnb24gZmlsbD0iI0ZGRiIgcG9pbnRzPSI3LjAyOCAxNy45NzIgMTAuMjM5IDIxLjE4MiA0LjU1MSAyMy4zMDEgNC41NDUgMjMuMjk1IDEuNzA1IDIwLjQ1NSAxLjY5MyAyMC40NDkgMy44MTggMTQuNzU2Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGQzEyRSIgZD0iTTIyLjIyMTU5MDksOS4xOTg4NjM2NCBMMTAuMjI3MjcyNywyMS4xODE4MTgyIEw3LjAxNzA0NTQ1LDE3Ljk3MTU5MDkgTDIxLjAyMjcyNzMsMy45NzcyNzI3MyBMMjQuMjA0NTQ1NSw3LjE1OTA5MDkxIEMyNC4xMDM5MjA0LDcuMjk3MTE5MjUgMjMuOTkxNzc2NSw3LjQyNjM2OTggMjMuODY5MzE4Miw3LjU0NTQ1NDU1IEwyMi4yMjcyNzI3LDkuMjA0NTQ1NDUgTDIyLjIyMTU5MDksOS4xOTg4NjM2NCBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGQzEyRSIgZD0iTTE1LjgwMTEzNjQsMi43Nzg0MDkwOSBMMTcuNDY1OTA5MSwxLjEzNjM2MzY0IEMxNy41ODY5NDk0LDEuMDEzODE0NjQgMTcuNzE4MDk0NiwwLjkwMTY3NjAyMSAxNy44NTc5NTQ1LDAuODAxMTM2MzY0IEwyMS4wMjI3MjczLDMuOTc3MjcyNzMgTDcuMDI4NDA5MDksMTcuOTcxNTkwOSBMMy44MTgxODE4MiwxNC43NzI3MjczIEwxNS44MDExMzY0LDIuNzc4NDA5MDkgWiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNDM0NDRTkiIGQ9Ik0yNSw0Ljc3ODQwOTA5IEMyNS4wMDgyNDY0LDUuNjI5NjU0NTcgMjQuNzM2NzY3Miw2LjQ2MDA2MTQxIDI0LjIyNzI3MjcsNy4xNDIwNDU0NSBMMjEuMDIyNzI3MywzLjk3NzI3MjczIEwxNy44NTc5NTQ1LDAuNzcyNzI3MjczIEMxOS40NzcyNzI3LC0wLjQ1NDU0NTQ1NSAyMS45MzE4MTgyLC0wLjIwNDU0NTQ1NSAyMy41Mzk3NzI3LDEuNDMxODE4MTggQzI0LjQ1MTM3MzMsMi4zMDkzNDI3NSAyNC45NzY2OTU3LDMuNTEzMjkxNzggMjUsNC43Nzg0MDkwOSBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTE1LjU4NzA1ODgsMi4xOTQ2MzgwOCBDMTUuODA5MDUxMywxLjk3Mjg1Mjk0IDE2LjE2ODgwNCwxLjk3MzAyMDk3IDE2LjM5MDU4OTIsMi4xOTUwMTMzOSBDMTYuNTk1MzEzOSwyLjM5OTkyOTQ3IDE2LjYxMDkxODgsMi43MjIyMjcxNiAxNi40Mzc1MDUxLDIuOTQ1MDM4OTIgTDE2LjM5MDIxMzksMi45OTg1NDM3MyBMNC42MjE1OTA5MSwxNC43NTU2ODE4IEwxMC4yMzg2MzY0LDIwLjM3Nzg0MDkgTDIyLjAwMTU1MDEsOC42MDk2OTIyNCBDMjIuMjA2MzIyNyw4LjQwNDgyMzk5IDIyLjUyODYwOTQsOC4zODg5OTMzMiAyMi43NTE1NDI2LDguNTYyMjUwODcgTDIyLjgwNTA4MDUsOC42MDk1MDQ2MyBDMjMuMDA5OTQ4Nyw4LjgxNDI3NzIzIDIzLjAyNTc3OTQsOS4xMzY1NjM5MiAyMi44NTI1MjE5LDkuMzU5NDk3MTEgTDIyLjgwNTI2ODEsOS40MTMwMzUwNCBMMTAuNjQwNDk1NCwyMS41ODM0ODk2IEMxMC40MzU2MjQ5LDIxLjc4ODQ1NTcgMTAuMTEzMTUyMiwyMS44MDQxOTAzIDkuODkwMjI1NjEsMjEuNjMwNzE2MSBMOS44MzY2OTM0OSwyMS41ODM0MDU3IEwzLjQxNjIzODk1LDE1LjE1NzI2OTMgQzMuMjExNTA1NTMsMTQuOTUyMzU0NyAzLjE5NTg5NjE5LDE0LjYzMDA1MDYgMy4zNjkzMTIzLDE0LjQwNzIzNDggTDMuNDE2NjA0MywxNC4zNTM3MjkgTDE1LjU4NzA1ODgsMi4xOTQ2MzgwOCBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTE3LjA2NDE0MzkuNzM0NTk4NDJDMTguODkxODgyNi0xLjA5MzE0MDM0IDIxLjk4MzM1NTctLjkyODEyOTIzNiAyMy45Njk5NDcgMS4wNTg0NjIwNiAyNS45MTY4ODI5IDMuMDA1Mzk3OTYgMjYuMTE0NDI3NyA2LjAxMzkwMDIzIDI0LjM5OTE0NjYgNy44NDk3MzE4MkwyNC4yOTE3MzggNy45NjA2NDU0NSAyMi42MjY5NjUyIDkuNjA4MzcyNzNDMjIuNDAzOTM3NiA5LjgyOTExNjgxIDIyLjA0NDE4OTUgOS44MjcyNjU2MiAyMS44MjM0NDU1IDkuNjA0MjM3OTggMjEuNjE5NjgxNyA5LjM5ODM2NjMxIDIxLjYwNTU4NDkgOS4wNzU5OTkxMyAyMS43ODAwMzkxIDguODU0MDAxMTVMMjEuODI3NTgwMiA4LjgwMDcxODE4IDIzLjQ5MDk5NyA3LjE1NDMzNzQ1QzI0Ljg1Mzg0MDggNS43OTYzNDM2NSAyNC43MjcwNTk3IDMuNDIyNjM1NjMgMjMuMTY2NDE2NiAxLjg2MTk5MjQ5IDIxLjY0MTg5NDUuMzM3NDcwMzk3IDE5LjM0MTM0ODQuMTgxMTE0Mzc0IDE3Ljk2MTg0OTkgMS40NDc5Njk3M0wxNy44NjQ5MDM2IDEuNTQwODgwNTcgMTYuMjAwMTMwOSAzLjE4MjkyNjAzQzE1Ljk3NjcyMjMgMy40MDMyODQ2MiAxNS42MTY5NzggMy40MDA4MTIxNSAxNS4zOTY2MTk0IDMuMTc3NDAzNjEgMTUuMTkzMjExNSAyLjk3MTE4MDM1IDE1LjE3OTY3MTUgMi42NDg3ODkzMSAxNS4zNTQ1MDg4IDIuNDI3MDkyOTRMMTUuNDAyMTQxOCAyLjM3Mzg5MjE2IDE3LjA2NDE0MzkuNzM0NTk4NDJ6TTMuMjg1Nzc3MjIgMTQuNTU3MjQ4MkMzLjM5NTM2OTEgMTQuMjYzMjA5MiAzLjcyMjU3NjU0IDE0LjExMzY4NTMgNC4wMTY2MTU0OCAxNC4yMjMyNzcyIDQuMjg5NjUxNjQgMTQuMzI1MDQxMSA0LjQzODA4MDQzIDE0LjYxNDQ0MjkgNC4zNzAxNDYxIDE0Ljg5MDY5MDhMNC4zNTA1ODY0MiAxNC45NTQxMTU1Ljk2NjQ3NzI3MyAyNC4wMzI5NTQ1IDEwLjA0MDEwNiAyMC42NDk0NDk2QzEwLjMxMzEyMzcgMjAuNTQ3NjM2MSAxMC42MTQ3ODEzIDIwLjY2OTIzODcgMTAuNzQ0MjcwNSAyMC45MjI1MzgxTDEwLjc3MTAwNDkgMjAuOTgzMjg3OEMxMC44NzI4MTg0IDIxLjI1NjMwNTUgMTAuNzUxMjE1OCAyMS41NTc5NjMxIDEwLjQ5NzkxNjUgMjEuNjg3NDUyM0wxMC40MzcxNjY3IDIxLjcxNDE4NjcuMTk4NTMwMzM5IDI1LjUzMjM2ODZDLS4yMzc3NDMwMDcgMjUuNjk1MDYzMi0uNjYzNzA4NzM0IDI1LjI5NTIxMzQtLjU1MTE0MjIwMiAyNC44NjA5NDgxTC0uNTMyNDA0NjAyIDI0LjgwMTU2NjMgMy4yODU3NzcyMiAxNC41NTcyNDgyeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyRDM0NkEiIGQ9Ik0xLjMwMjc4MDI0LDIwLjA1Mjc4MDIgQzEuNTA3NjAwNjcsMTkuODQ3OTU5OCAxLjgyOTg5MTA0LDE5LjgzMjIwNDQgMi4wNTI3ODM3NywyMC4wMDU1MTQgTDIuMTA2MzEwNjcsMjAuMDUyNzgwMiBMNC45NDcyMTk3NiwyMi44OTM2ODkzIEM1LjE2OTEwODU2LDIzLjExNTU3ODEgNS4xNjkxMDg1NiwyMy40NzUzMzEgNC45NDcyMTk3NiwyMy42OTcyMTk4IEM0Ljc0MjM5OTMzLDIzLjkwMjA0MDIgNC40MjAxMDg5NiwyMy45MTc3OTU2IDQuMTk3MjE2MjMsMjMuNzQ0NDg2IEw0LjE0MzY4OTMzLDIzLjY5NzIxOTggTDEuMzAyNzgwMjQsMjAuODU2MzEwNyBDMS4wODA4OTE0NCwyMC42MzQ0MjE5IDEuMDgwODkxNDQsMjAuMjc0NjY5IDEuMzAyNzgwMjQsMjAuMDUyNzgwMiBaIi8+CiAgICAgICAgPHBvbHlnb24gZmlsbD0iIzJEMzQ2QSIgcG9pbnRzPSIxOC4yNiAuMzcxIDI0LjY1MiA2Ljc2MyAyMy44NDggNy41NjcgMTcuNDU2IDEuMTc0Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJEMzQ2QSIgZD0iTTIwLjY0Mzc3MDgsMy41NTgzODA2MiBDMjAuODY1NzA0NiwzLjMzNjUzNjggMjEuMjI1NDU3NCwzLjMzNjYwOTczIDIxLjQ0NzMwMTIsMy41NTg1NDM1MSBDMjEuNjUyMDgwMSwzLjc2MzQwNTQ2IDIxLjY2Nzc3MDIsNC4wODU2OTkwMiAyMS40OTQ0MTU0LDQuMzA4NTU2NjEgTDIxLjQ0NzEzODMsNC4zNjIwNzM5MyBMNy40MzAwOTI4NSwxOC4zNzM0Mzc2IEM3LjIwODE1OTA4LDE4LjU5NTI4MTQgNi44NDg0MDYyNiwxOC41OTUyMDg1IDYuNjI2NTYyNDQsMTguMzczMjc0NyBDNi40MjE3ODM1MywxOC4xNjg0MTI3IDYuNDA2MDkzNDUsMTcuODQ2MTE5MiA2LjU3OTQ0ODIyLDE3LjYyMzI2MTYgTDYuNjI2NzI1MzMsMTcuNTY5NzQ0MyBMMjAuNjQzNzcwOCwzLjU1ODM4MDYyIFoiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==';
      }
    }, {
      key: "assetEraser",
      value: function assetEraser() {
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyMyIgdmlld0JveD0iMCAwIDI1IDIzIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzggLTUzMzYpIj4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMSA1MjY3KSI+CiAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcgNjkpIj4KICAgICAgICA8cGF0aCBmaWxsPSIjRkYyQzU1IiBkPSJNNC45OCwxMi45ODM2IEwwLjkxNywxNy4xODY2IEMwLjM2MSwxNy43NjA2IDAuMzYxLDE4LjY4OTYgMC45MTcsMTkuMjYzNiBMNC4wNDgsMjIuNTAzNiBMOS45NTYsMjIuNTAzNiBMMTIuMTg5LDIwLjE5MjYgTDQuOTgsMTIuOTgzNiBaIi8+CiAgICAgICAgPHBvbHlnb24gZmlsbD0iI0ZDMCIgcG9pbnRzPSIxNi41IC41MDMgMjQuNSA4LjUwMyAxMi41IDIwLjUwMyA0LjUgMTIuNTAzIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTEyLjUsMTkuNzk2MSBMNS4yMDcsMTIuNTAzMSBMMTYuNSwxLjIxMDEgTDIzLjc5Myw4LjUwMzEgTDEyLjUsMTkuNzk2MSBaIE05Ljc0NCwyMi4wMDMxIEw0LjI2LDIyLjAwMzEgTDEuMjc2LDE4LjkxNjEgQzAuOTA4LDE4LjUzNTEgMC45MDgsMTcuOTE1MSAxLjI3NiwxNy41MzQxIEw0Ljk4NiwxMy42OTYxIEwxMS40ODgsMjAuMTk4MSBMOS43NDQsMjIuMDAzMSBaIE0xNi44NTQsMC4xNTAxIEMxNi42NTgsLTAuMDQ1OSAxNi4zNDIsLTAuMDQ1OSAxNi4xNDYsMC4xNTAxIEw0LjE0NiwxMi4xNTAxIEMzLjk1MSwxMi4zNDUxIDMuOTUxLDEyLjY2MTEgNC4xNDYsMTIuODU3MSBMNC4yNzksMTIuOTg5MSBMMC41NTcsMTYuODM5MSBDLTAuMTgyLDE3LjYwNDEgLTAuMTgyLDE4Ljg0NzEgMC41NTcsMTkuNjExMSBMMi44NjksMjIuMDAzMSBMMC41LDIyLjAwMzEgQzAuMjI0LDIyLjAwMzEgMCwyMi4yMjcxIDAsMjIuNTAzMSBDMCwyMi43NzkxIDAuMjI0LDIzLjAwMzEgMC41LDIzLjAwMzEgTDQuMDQ4LDIzLjAwMzEgTDkuOTU2LDIzLjAwMzEgTDE2LjUsMjMuMDAzMSBDMTYuNzc2LDIzLjAwMzEgMTcsMjIuNzc5MSAxNywyMi41MDMxIEMxNywyMi4yMjcxIDE2Ljc3NiwyMi4wMDMxIDE2LjUsMjIuMDAzMSBMMTEuMTM0LDIyLjAwMzEgTDEyLjIwNSwyMC44OTYxIEMxMi4yOTMsMjAuOTYyMSAxMi4zOTUsMjEuMDAzMSAxMi41LDIxLjAwMzEgQzEyLjYyOCwyMS4wMDMxIDEyLjc1NiwyMC45NTQxIDEyLjg1NCwyMC44NTcxIEwyNC44NTQsOC44NTcxIEMyNS4wNDksOC42NjExIDI1LjA0OSw4LjM0NTEgMjQuODU0LDguMTUwMSBMMTYuODU0LDAuMTUwMSBaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTIzLjg1MzUsNy4xNDk2IEMyMy42NTg1LDYuOTU0NiAyMy4zNDE1LDYuOTU0NiAyMy4xNDY1LDcuMTQ5NiBMMTEuNDk1NSwxOC44MDA2IEMxMS40MTE1LDE4Ljc0MTYgMTEuMzEwNSwxOC43MDk2IDExLjIwNjUsMTguNzA5NiBDMTEuMTAxNSwxOC43MDk2IDEwLjk0MDUsMTguNzYzNiAxMC44NDY1LDE4Ljg2MTYgTDkuNzQzNSwyMC4wMDM2IEw0LjI1OTUsMjAuMDAzNiBMMS4zMDg1LDE2Ljk1MTYgQzEuMjkyNSwxNi45Mjc2IDEuMjc1NSwxNi45MDQ2IDEuMjU5NSwxNi44ODc2IEMxLjE2NTUsMTYuNzg0NiAxLjAzMTUsMTYuNzI1NiAwLjg5MTUsMTYuNzI1NiBMMC44OTA1LDE2LjcyNTYgQzAuNzQ5NSwxNi43MjU2IDAuNjE1NSwxNi43ODU2IDAuNTIxNSwxNi44ODk2IEMtMC4xODM1LDE3LjY2NzYgLTAuMTY3NSwxOC44NjI2IDAuNTU2NSwxOS42MTE2IEwzLjY4ODUsMjIuODUwNiBDMy43ODI1LDIyLjk0ODYgMy45MTI1LDIzLjAwMzYgNC4wNDc1LDIzLjAwMzYgTDkuOTU1NSwyMy4wMDM2IEMxMC4wOTA1LDIzLjAwMzYgMTAuMjIwNSwyMi45NDg2IDEwLjMxNDUsMjIuODUwNiBMMTIuMTk5NSwyMC45MDI2IEMxMi4zOTE1LDIxLjA0OTYgMTIuNjc0NSwyMS4wMzU2IDEyLjg1MzUsMjAuODU2NiBMMjQuODUzNSw4Ljg1NjYgQzI1LjA0ODUsOC42NjE2IDI1LjA0ODUsOC4zNDQ2IDI0Ljg1MzUsOC4xNDk2IEwyMy44NTM1LDcuMTQ5NiBaIiBvcGFjaXR5PSIuMTIiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==';
      }
    }]);

    return WebupRgbPannel;
  }();

  return WebupRgbPannel;

})));
