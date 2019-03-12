function parseString(str) {
    const parts = str.split(',').map(p => p.replace(/[^\d]/g, ''));

    if (parts.length !== 3) {
        throw new Error('Invalid pixel input it accepts, (r,g,b)');
    }

    return {
        r: parts[1],
        g: parts[2],
        b: parts[3]
    };
}

function sanitize(value, min, max) {
    const num = parseInt(value, 10);

    if (isNaN(num)) {
        return min;
    }

    return Math.max(min, Math.min(max, num));
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

class Pixel {
    constructor(opts) {
        if (typeof opts === 'string') {
            opts = parseString(opts);
        }

        const { r, g, b } = opts;

        this.r = sanitize(r, 0, 255);
        this.g = sanitize(g, 0, 255);
        this.b = sanitize(b, 0, 255);
    }

    get color() {
        return rgb2Int(this.r, this.g, this.b);
    }
}

module.exports = Pixel;
