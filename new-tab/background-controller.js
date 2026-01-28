const TextColors = {
    BLACK: 0,
    WHITE: 1
}

class BackgroundController {
    static DEFAULT_COLOR = "#212121";

    constructor(element) {
        this.element = element
        this.makeColorInput()
        this.makeImageInput() // added for image import
        this.startListeners()
        this.displaySavedBackground() // updated to handle image or color
    }

    makeColorInput() {
        this.colorInput = document.createElement('input')
        this.colorInput.type = "color"
        this.colorInput.value = this.getSavedColor()
        this.colorInput.style.visibility = "hidden"
        this.element.parentElement.appendChild(this.colorInput)
    }

    // IMAGE INPUT
    makeImageInput() {
        this.imageInput = document.createElement('input')
        this.imageInput.type = "file"
        this.imageInput.accept = "image/*"
        this.imageInput.style.visibility = "hidden"
        this.element.parentElement.appendChild(this.imageInput)
        this.imageInput.addEventListener('change', this.onImageSelected.bind(this))
    }

    startListeners() {
        this.element.addEventListener('click', this.onClicked.bind(this))
        this.colorInput.addEventListener('input', this.onInput.bind(this))
    }

    onClicked() {
        const choice = confirm("Click OK to pick a color, Cancel to import an image.")
        if (choice) {
            this.colorInput.click()
        } else {
            this.imageInput.click()
        }
    }

    onInput() {
        let value = this.colorInput.value
        this.setSavedColor(value)
        this.setSavedImage(null) // clear image if choosing color
        this.displayColor(value)
    }

    getSavedColor() {
        return localStorage.savedColor ?? BackgroundController.DEFAULT_COLOR
    }

    setSavedColor(value) {
        if (value) {
            localStorage.savedColor = value
        } else {
            localStorage.removeItem("savedColor")
        }
    }

    hasSavedColor() {
        return Boolean(localStorage.savedColor)
    }

    displayColor(color) {
        document.body.style.backgroundImage = "" // remove any image
        document.body.style.backgroundColor = color
        if (BackgroundController.getTextColor(color) === TextColors.BLACK) {
            document.body.classList.add("black-text")
        } else {
            document.body.classList.remove("black-text")
        }
    }

    // IMAGE HANDLING
    onImageSelected(event) {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = reader.result
            this.setSavedImage(dataUrl)
            this.setSavedColor(null) // clear color if using image
            this.displayImage(dataUrl)
        }
        reader.readAsDataURL(file)
    }

    setSavedImage(dataUrl) {
        if (dataUrl) {
            localStorage.savedImage = dataUrl
        } else {
            localStorage.removeItem("savedImage")
        }
    }

    getSavedImage() {
        return localStorage.savedImage ?? null
    }

    displayImage(dataUrl) {
        document.body.style.backgroundColor = ""
        document.body.style.backgroundImage = `url(${dataUrl})`
        document.body.style.backgroundSize = "cover"
        document.body.style.backgroundPosition = "center"
        document.body.classList.remove("black-text") // optional, could add dynamic text color later
    }

    displaySavedBackground() {
        const savedImage = this.getSavedImage()
        if (savedImage) {
            this.displayImage(savedImage)
        } else if (this.hasSavedColor()) {
            this.displayColor(this.getSavedColor())
        } else {
            this.displayColor(BackgroundController.DEFAULT_COLOR)
        }
    }

    static getTextColor(color) {
        let [r, g, b] = [1, 3, 5].map(n => parseInt(color.substr(n, 2), 16));
        let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? TextColors.BLACK : TextColors.WHITE;
    }
}

export { BackgroundController }
