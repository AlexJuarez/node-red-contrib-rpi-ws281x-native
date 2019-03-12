module.exports = function (RED) {
    const Aurora = require('./lib/aurora');

    function PiAuroraNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        const aurora = new Aurora();
        node.brightness = n.brightness;

        switch (n.pmode) {
            case 'global':
                node.pixels = node.context().global[n.pvalue];
                break;
            case 'number':
            case 'text':
            default:
                node.pixels = Number(n.pvalue);
        }

        try {
            aurora.ledCount = node.pixels;
            aurora.brightness = node.brightness;
            node.status({ fill: 'green', shape: 'dot', text: 'ready' });
        } catch (err) {
            node.status({ fill: 'red', shape: 'dot', text: err.message});
        }

        function msgHandler(msg) {
            const { topic, payload } = msg;
            switch (topic) {
                case 'brightness':
                    aurora.brightness = msg.payload;
                    break;
                case 'wipe':
                    aurora.setPixels(new Array(aurora.ledCount).fill('0,0,0'));
                    aurora.refresh();
                    break;
                case 'update':
                    aurora.refresh();
                    break;
                default: {
                    if (Array.isArray(payload)) {
                        aurora.setPixels(payload);
                    } else if (typeof payload === 'string' && payload.includes(',')) {
                        const [index, ...rest] = payload.split(',');
                        aurora.setPixel(index, rest.join(','));
                    }
                }
            }
        }
    }
};
