//consvert in GB
function bytesToGB(bytes) {
    var gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2); // Round to 2 decimal places
}

module.exports = bytesToGB;