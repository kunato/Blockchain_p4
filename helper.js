function decode(string) {
    return new Buffer(string, 'hex');
}

module.exports = { decode };
