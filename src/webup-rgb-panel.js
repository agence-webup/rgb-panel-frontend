const CSS = {
  toolSelected: 'toolSelected'
}

export default class WebupRgbPanel {
  constructor (panelTarget, toolsTarget, widthValue, heightValue, endpoint, sendButtonId, clearButtonId) {
    this.panelId = panelTarget
    this.toolsId = toolsTarget
    this.width = widthValue
    this.height = heightValue
    this.apiEndpoint = endpoint
    this.matrix = []

    this.mode = 1 // 0: erase, 1:pen
    this.thickness = 2 // 1|2|3
    this.color = '#2FCC71'
    this.mouseDown = false
    this.thicknessPanelVisible = false
    this.rgbWrapper = document.getElementById('webup_rgb')
    this.canvas = this.panelId
    this.sendButton = document.getElementById(sendButtonId)
    this.clearButton = document.getElementById(clearButtonId)

    this.ui = {
      btnSize1: document.createElement('button'),
      btnSize2: document.createElement('button'),
      btnSize3: document.createElement('button'),
      btnPencil: document.createElement('button'),
      btnErase: document.createElement('button'),
      btnColor: document.createElement('button'),
      inputColor: document.createElement('input')
    }

    this.ui.btnSize1.innerHTML = this.asset('size1')
    this.ui.btnSize2.innerHTML = this.asset('size2')
    this.ui.btnSize3.innerHTML = this.asset('size3')
    this.ui.btnPencil.innerHTML = this.asset('pencil')
    this.ui.btnErase.innerHTML = this.asset('erase')
    this.ui.btnColor.innerHTML = this.asset('color')
    this.ui.btnColor.appendChild(this.ui.inputColor)

    this.ui.inputColor.type = 'color'
    this.ui.inputColor.value = this.color
    this.ui.inputColor.tabindex = -1
    this.ui.inputColor.classList.add('rgbpanel-hidden')

    this.toolsId.appendChild(this.ui.btnSize1)
    this.toolsId.appendChild(this.ui.btnSize2)
    this.toolsId.appendChild(this.ui.btnSize3)
    this.toolsId.appendChild(this.ui.btnPencil)
    this.toolsId.appendChild(this.ui.btnErase)
    this.toolsId.appendChild(this.ui.btnColor)

    this.messageBox = document.getElementById('message')

    this.init()
    this.bindEvents()
  }

  bindEvents () {
    this.canvas.addEventListener('mousedown', () => {
      this.mouseDown = true
    })

    this.canvas.addEventListener('touchstart', () => {
      this.mouseDown = true
    })

    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false
    })

    this.canvas.addEventListener('touchend', () => {
      this.mouseDown = false
    })

    this.canvas.addEventListener('mousemove', e => {
      if (this.mouseDown === true) {
        const canvasWidth = this.canvas.getBoundingClientRect().width
        const imageWidth = this.matrix.length * 13

        const ratio = imageWidth / canvasWidth

        const mouseX = (e.pageX - this.canvas.offsetLeft) * ratio
        const mouseY = (e.pageY - this.canvas.offsetTop) * ratio
        this.drawOnCanvas(mouseX, mouseY, this.color)
      }
    })

    this.canvas.addEventListener('touchmove', e => {
      if (this.mouseDown === true) {
        e.preventDefault()
        const canvasWidth = this.canvas.getBoundingClientRect().width
        const imageWidth = this.matrix.length * 13

        const ratio = imageWidth / canvasWidth

        const mouseX = (e.pageX - this.canvas.offsetLeft) * ratio
        const mouseY = (e.pageY - this.canvas.offsetTop) * ratio

        this.drawOnCanvas(mouseX, mouseY, this.color)
      }
    })

    this.ui.inputColor.addEventListener('change', () => {
      this.setColor(this.ui.inputColor.value)
    })

    this.ui.inputColor.addEventListener('input', () => {
      this.setColor(this.ui.inputColor.value)
    })

    this.ui.btnSize1.addEventListener('click', () => {
      this.setThickness(1)
    })

    this.ui.btnSize2.addEventListener('click', () => {
      this.setThickness(2)
    })

    this.ui.btnSize3.addEventListener('click', () => {
      this.setThickness(3)
    })

    this.ui.btnPencil.addEventListener('click', () => {
      if (this.mode !== 1) {
        this.mode = 1
        if (this.ui.btnErase.classList.contains('toolSelected')) {
          this.ui.btnErase.classList.remove('toolSelected')
        }
        this.ui.btnPencil.classList.add('toolSelected')
      }
    })

    this.ui.btnErase.addEventListener('click', () => {
      if (this.mode !== 0) {
        this.mode = 0
        if (this.ui.btnPencil.classList.contains('toolSelected')) {
          this.ui.btnPencil.classList.remove('toolSelected')
        }
        this.ui.btnErase.classList.add('toolSelected')
      }
    })

    this.ui.btnColor.addEventListener('click', () => {
      this.ui.inputColor.click()
    })

    this.sendButton.addEventListener('click', () => {
      this.send()
    })

    this.clearButton.addEventListener('click', () => {
      this.init()
    })
  }

  init () {
    this.setColor(this.color)
    this.ui.btnSize2.classList.add(CSS.toolSelected)
    this.ui.btnPencil.classList.add(CSS.toolSelected)

    // reset matrix just in case
    this.matrix = []
    const matrixCol = []

    // create columns
    for (let i = 0; i < this.height; i++) {
      matrixCol.push('#000')
    }

    // create columns
    for (let i = 0; i < this.width; i++) {
      this.matrix.push(matrixCol)
    }

    this.drawCanvas()
  }

  setThickness (thickness) {
    this.ui.btnSize1.classList.remove(CSS.toolSelected)
    this.ui.btnSize2.classList.remove(CSS.toolSelected)
    this.ui.btnSize3.classList.remove(CSS.toolSelected)

    switch (thickness) {
      case 1:
        this.thickness = 1
        this.ui.btnSize1.classList.add(CSS.toolSelected)
        break

      case 2:
        this.thickness = 2
        this.ui.btnSize2.classList.add(CSS.toolSelected)
        break

      case 3:
        this.thickness = 3
        this.ui.btnSize3.classList.add(CSS.toolSelected)
        break

      default:
        break
    }
  }

  setColor (color) {
    this.color = color
    this.ui.btnSize1.style.color = color
    this.ui.btnSize2.style.color = color
    this.ui.btnSize3.style.color = color
  }

  drawCanvas () {
    if (this.canvas.getContext) {
      var ctx = this.canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.lineWidth = 1

      // start with x = y = 0
      // these are used as coordinates for drawing each "pixel"
      let x = 0
      let y = 0

      // start with x2 = y2 = 3
      // as x and y above, but for the inner square, which actually displays the color
      let x2 = 3
      let y2 = 3

      // loop through rows and draw them
      for (let i = 0; i < this.matrix.length; i++) {
        // loop again through items in row, draw them
        for (let j = 0; j < this.matrix[i].length; j++) {
          ctx.strokeStyle = '#8E8E8E'
          ctx.strokeRect(x, y, 13, 13)
          ctx.fillStyle = '#5A5A5A'
          ctx.fillRect(x + 1, y + 1, 12, 12)
          ctx.fillStyle = this.matrix[i][j] == '#000' ? '#CACACA' : this.matrix[i][j]
          ctx.fillRect(x2, y2, 8, 8)

          // bump up x coordinates for next iteration
          y += 13
          y2 += 13
        }

        // reinitialize coordinates for next line
        x += 13
        y = 0

        x2 += 13
        y2 = 3
      }
    }
  }

  drawOnCanvas (x, y, color) {
    // figure out which pixel in the matrix should be changed
    // this shouldn't be too difficult given the fact that each square drawn on the canvas is
    // mapped as 1:1 to a "pixel" in the matrix that controls the canvas-drawn matrix

    // each square on the canvas is 13x13 pixels, so we can perform a floor division on the coordinate to get its position in the matrix

    const pixelX = Math.abs(Math.floor(x / 13))
    const pixelY = Math.abs(Math.floor(y / 13))

    const xCoords = []
    const yCoords = []

    // add single point
    xCoords.push(pixelX)
    yCoords.push(pixelY)

    if (this.thickness > 1) {
      // produces a shape like this:
      // 11
      // 11

      if (pixelY - 1 >= 0) {
        yCoords.push(pixelY - 1)
      }
      if (pixelX + 1 <= this.width - 1) {
        xCoords.push(pixelX + 1)
      }
    }

    if (this.thickness > 2) {
      // produces a shape like this:
      // 111
      // 111
      // 111

      if (pixelX - 1 >= 0) {
        xCoords.push(pixelX - 1)
      }

      if (pixelY + 1 <= this.width - 1) {
        yCoords.push(pixelY + 1)
      }
    }

    const newMatrix = []

    for (let i = 0; i < this.matrix.length; i++) {
      // there's some heavy use of JSON.stringify() and JSON.parse() here because we need to actually make copies of each variable
      // rather than passing a reference, in order to counteract JavaScript's default behavior
      let tempArray = []
      tempArray = JSON.parse(JSON.stringify(this.matrix[i]))

      if (xCoords.includes(i)) {
        if (this.mode === 1) {
          for (let j = 0; j < yCoords.length; j++) {
            tempArray[yCoords[j]] = this.color
          }
          // tempArray[pixelY] = color
        }
        if (this.mode === 0) {
          tempArray[pixelY] = '#000'
        }
      }

      newMatrix.push(JSON.parse(JSON.stringify(tempArray)))
    }

    this.matrix = newMatrix

    // redraw new point on the panel if the thickness is 1
    if (this.thickness === 1) {
      var ctx = this.canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle =
          this.matrix[pixelX][pixelY] === '#000' ? '#BABABA' : this.matrix[pixelX][pixelY]
      ctx.fillRect(pixelX * 13 + 3, pixelY * 13 + 3, 8, 8)
    } else {
      this.drawCanvas()
    }
  }

  sendDrawing () {
    const drawing = []
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] !== '#000') {
          const rgb = this.hexToRgb(this.matrix[i][j])
          drawing.push({
            // using the + operand in order to make sure integers are being passed into the object
            x: +i,
            y: +j,
            r: +rgb.r,
            g: +rgb.g,
            b: +rgb.b
          })
        }
      }
    }

    const drawingJson = {
      drawing: drawing
    }

    // if drawing is empty, inform the user and cancel
    if (drawing.length < 1) {
      alert('Dessinez ou écrivez quelque chose à envoyer !')
      return false
    }

    const req = new XMLHttpRequest()
    req.addEventListener('load', this.init())
    req.addEventListener('error', this.sendError)
    req.open('POST', `${this.apiEndpoint}/send/drawing`)
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(JSON.stringify(drawingJson))
  }

  sendMessage () {
    const msg = this.messageBox.value

    const msgJson = {
      text: msg
    }

    const req = new XMLHttpRequest()
    req.addEventListener('load', () => { this.messageBox.value = ''; this.init() })
    req.addEventListener('error', this.sendError)
    req.open('POST', `${this.apiEndpoint}/send/message`)
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(JSON.stringify(msgJson))
  }

  hexToRgb (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
      : null
  }

  sendError () {
    alert('Une erreur est survenue')
  }

  send () {
    if (this.messageBox !== null) {
      if (this.messageBox.value.length > 0) {
        this.sendMessage()
      } else {
        this.sendDrawing()
      }
    } else {
      this.sendDrawing()
    }
  }

  asset (name) {
    switch (name) {
      case 'size1':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><path fill="currentColor" d="M38 38h25v25H38z"/></g></svg>'
      case 'size2':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><path fill="currentColor" d="M30 30h40v40H30z"/></g></svg>'
      case 'size3':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><path fill="currentColor" d="M23 23h55v55H23z"/></g></svg>'
      case 'color':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><g fill-rule="nonzero"><path d="M16.52 49.949c0-22.28 16.71-33.42 33.42-33.42 19.495 0 33.42 16.71 33.42 27.85 0 11.139-5.57 13.925-13.925 13.925s-11.14 5.569-11.14 13.924-5.57 11.14-11.142 11.14c-11.138 0-30.634-11.14-30.634-33.42" fill="#FFF"/><path d="M49.94 69.697a4.557 4.557 0 11-9.115 0 4.557 4.557 0 019.114 0" fill="#4CD964"/><path d="M37.786 57.544a4.557 4.557 0 11-9.114 0 4.557 4.557 0 019.114 0" fill="#339EFF"/><path d="M37.786 40.834a6.079 6.079 0 01-6.076 6.076 6.079 6.079 0 01-6.076-6.076 6.079 6.079 0 016.076-6.076 6.079 6.079 0 016.076 6.076" fill="#FC0"/><path d="M56.016 31.72a6.079 6.079 0 01-6.077 6.076 6.079 6.079 0 01-6.076-6.077 6.079 6.079 0 016.076-6.076 6.079 6.079 0 016.077 6.076" fill="#FF2C55"/><path d="M74.245 40.834a6.079 6.079 0 01-6.077 6.076 6.079 6.079 0 01-6.076-6.076 6.079 6.079 0 016.076-6.076 6.079 6.079 0 016.077 6.076" fill="#7F2EFF"/><path d="M72.726 40.834a4.563 4.563 0 01-4.558 4.557 4.563 4.563 0 01-4.557-4.557 4.563 4.563 0 014.557-4.557 4.563 4.563 0 014.558 4.557m-12.153 0c0 4.19 3.409 7.596 7.595 7.596 4.187 0 7.596-3.406 7.596-7.596 0-4.19-3.409-7.595-7.596-7.595-4.186 0-7.595 3.405-7.595 7.595m-10.634-4.557a4.563 4.563 0 01-4.557-4.558 4.563 4.563 0 014.557-4.557 4.563 4.563 0 014.558 4.557 4.563 4.563 0 01-4.558 4.558m0-12.153c-4.186 0-7.595 3.406-7.595 7.595 0 4.19 3.409 7.596 7.595 7.596 4.187 0 7.596-3.406 7.596-7.596 0-4.19-3.41-7.595-7.596-7.595m-22.786 16.71a4.563 4.563 0 014.557-4.557 4.563 4.563 0 014.557 4.557 4.563 4.563 0 01-4.557 4.557 4.563 4.563 0 01-4.557-4.557m12.153 0c0-4.19-3.41-7.595-7.596-7.595-4.187 0-7.595 3.405-7.595 7.595 0 4.19 3.408 7.596 7.595 7.596 4.187 0 7.596-3.406 7.596-7.596m-6.077 19.748a3.041 3.041 0 01-3.038-3.038 3.041 3.041 0 013.038-3.038 3.041 3.041 0 013.038 3.038 3.041 3.041 0 01-3.038 3.038m0-9.114a6.083 6.083 0 00-6.076 6.076 6.083 6.083 0 006.076 6.077 6.083 6.083 0 006.077-6.077 6.083 6.083 0 00-6.077-6.076m12.153 21.267a3.041 3.041 0 01-3.038-3.038 3.041 3.041 0 013.038-3.038 3.041 3.041 0 013.038 3.038 3.041 3.041 0 01-3.038 3.038m0-9.114a6.083 6.083 0 00-6.076 6.076 6.083 6.083 0 006.076 6.076 6.083 6.083 0 006.076-6.076 6.083 6.083 0 00-6.076-6.076m24.053-6.836c-8.4 0-12.66 5.195-12.66 15.443 0 8.373-6.028 9.622-9.622 9.622-10.448 0-29.115-10.661-29.115-31.901 0-21.918 16.537-31.901 31.901-31.901 18.506 0 31.901 15.728 31.901 26.332 0 10.296-4.958 12.405-12.405 12.405M49.94 15.009C33.111 15.01 15 25.944 15 49.95c0 23.263 20.614 34.939 32.153 34.939 7.927 0 12.66-4.734 12.66-12.66 0-8.58 2.969-12.405 9.622-12.405 7.189 0 15.443-1.756 15.443-15.443 0-11.828-14.671-29.37-34.939-29.37" fill="#2D346A"/></g></g></svg>'
      case 'pencil':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><g fill-rule="nonzero"><path fill="#2D346A" d="M29.392 78.003l-11.8 4.404 4.39-11.799.03.015 7.365 7.365z"/><path fill="#FFF" d="M35.814 64.186l8.323 8.322-14.745 5.495-.015-.015-7.365-7.365-.03-.015 5.51-14.76z"/><path d="M75.204 41.441L44.108 72.508l-8.323-8.322 36.311-36.282 8.25 8.25c-.262.357-.553.692-.87 1l-4.257 4.302-.015-.015z" fill="#FFC12E"/><path d="M58.559 24.796l4.316-4.257a7.955 7.955 0 011.016-.87l8.205 8.235-36.282 36.282-8.322-8.294 31.067-31.096z" fill="#FFC12E"/><path d="M82.407 29.981a10.076 10.076 0 01-2.003 6.128l-8.308-8.205-8.205-8.308c4.198-3.182 10.562-2.534 14.73 1.709a12.359 12.359 0 013.786 8.676z" fill="#C3CCE9"/><g fill="#2D346A"><path d="M58.003 23.282a1.473 1.473 0 012.205 1.946l-.122.139-30.512 30.481 14.563 14.576 30.497-30.51a1.473 1.473 0 011.944-.123l.139.123c.531.53.572 1.366.123 1.944l-.123.139L45.18 73.55a1.473 1.473 0 01-1.945.122l-.139-.122L26.45 56.89a1.473 1.473 0 01-.122-1.945l.122-.139 31.553-31.524z"/><path d="M61.833 19.497c4.739-4.738 12.753-4.31 17.904.84 5.048 5.047 5.56 12.847 1.113 17.607l-.279.287-4.316 4.272a1.473 1.473 0 01-2.196-1.956l.124-.138 4.312-4.268c3.533-3.52 3.205-9.675-.841-13.721-3.953-3.952-9.917-4.358-13.494-1.073l-.251.24-4.316 4.258a1.473 1.473 0 01-2.192-1.96l.123-.138 4.309-4.25zM26.111 55.334a1.473 1.473 0 012.812.864l-.051.165L20.098 79.9l23.524-8.772a1.473 1.473 0 011.826.708l.07.158a1.473 1.473 0 01-.709 1.825l-.157.07-26.545 9.899c-1.13.421-2.235-.615-1.943-1.741l.048-.154 9.9-26.56z"/><path d="M20.97 69.581a1.473 1.473 0 011.945-.122l.138.122 7.366 7.366a1.473 1.473 0 01-1.945 2.205l-.139-.122-7.365-7.365a1.473 1.473 0 010-2.084zM64.933 18.554l16.572 16.572-2.084 2.084L62.85 20.638z"/><path d="M71.113 26.818a1.473 1.473 0 012.206 1.945l-.123.139-36.34 36.325a1.473 1.473 0 01-2.206-1.944l.123-.14 36.34-36.325z"/></g></g></g></svg>'
      case 'erase':
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h100v100H0z"/><g fill-rule="nonzero"><path d="M28.944 54.354L17.568 66.122c-1.557 1.608-1.557 4.209 0 5.816l8.766 9.072h16.543l6.252-6.47-20.185-20.186z" fill="#FF2C55"/><path fill="#FC0" d="M61.2 19.409l22.4 22.4-33.6 33.6-22.4-22.4z"/><path d="M50 73.43L29.58 53.008l31.62-31.62 20.42 20.42L50 73.429zm-7.717 6.179H26.928l-8.355-8.644a2.808 2.808 0 010-3.87L28.96 56.35l18.205 18.206-4.883 5.054zM62.191 18.42a1.4 1.4 0 00-1.982 0l-33.6 33.6a1.401 1.401 0 000 1.98l.372.37L16.56 65.15c-2.07 2.141-2.07 5.622 0 7.761l6.473 6.698H16.4a1.4 1.4 0 000 2.8h44.8a1.4 1.4 0 000-2.8H46.175l2.999-3.1c.246.185.532.3.826.3.358 0 .717-.138.991-.41l33.6-33.6a1.401 1.401 0 000-1.979l-22.4-22.4z" fill="#000"/><path d="M81.79 38.019a1.401 1.401 0 00-1.98 0L47.187 70.642a1.408 1.408 0 00-.809-.255c-.294 0-.745.151-1.008.425l-3.088 3.198H26.927l-8.263-8.546a1.397 1.397 0 00-1.168-.633h-.003c-.394 0-.77.169-1.033.46-1.974 2.178-1.929 5.524.098 7.621l8.77 9.07c.263.274.627.428 1.005.428h16.542c.378 0 .742-.154 1.006-.428l5.278-5.455c.537.412 1.33.373 1.83-.129l33.6-33.6a1.401 1.401 0 000-1.98l-2.8-2.8z" fill="#000" opacity=".12"/></g></g></svg>'
      default:
        return null
    }
  }
}
