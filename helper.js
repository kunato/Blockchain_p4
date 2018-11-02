function decode(string) {
    return new Buffer(string, 'hex').toString();
}

module.exports = { decode };
