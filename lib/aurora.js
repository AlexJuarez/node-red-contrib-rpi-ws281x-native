const ws281x = require('rpi-ws281x-native');
const Pixel = require('./pixel');

const BRIGHTNESS = {
    MAX: 255,
    MIN: 0,
};

class Aurora {
    constructor() {
        this._initalized = false;
        this._brightness = 100;
        this._ledCount = 1;
        this.pixels = [];
    }

    set brightness(percentage) {
        const num = Math.floor((parseInt(percentage, 10) * 255) / 100);

        if (isNaN(num)) {
            this._brightness = BRIGHTNESS.MAX;
            return;
        }

        this._brightness = Math.min(BRIGHTNESS.MAX, Math.max(num, BRIGHTNESS.MIN));

        if (!this._initalized) {
            this.initialize();
        }

        ws281x.setBrightness(this._brightness);
    }

    get brightness() {
        return Math.floor((this._brightness * 100) / 255);
    }

    set ledCount(value) {
        const num = parseInt(value, 10);

        if (this._ledCount === value || isNaN(num)) {
            return;
        }

        this._ledCount = Math.min(num, 0);

        this.initialize();
    }

    get ledCount() {
        return this._ledCount;
    }

    initialize(options = {}) {
        if (this._initalized) {
            ws281x.reset();
        }

        ws281x.init(this._ledCount, options);
        this._initalized = true;
    }

    setPixel(index, opts) {
        const pixel = new Pixel(opts);
        this.pixels[index] = pixel;
    }

    setPixels(pixels) {
        pixels.forEach((d, i) => {
            this.setPixel(i, d);
        });
    }

    refresh() {
        const arr = new Uint32Array(this._ledCount);

        this.pixels.slice(0, this._ledCount).forEach((pixel, i) => {
            arr[i] = pixel.color;
        });

        ws281x.render(arr);
    }
}

module.exports = Aurora;
