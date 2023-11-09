const tokens = (nToken) => {
    return ethers.parseUnits(nToken.toString(), "wei")
}

module.exports = [
    tokens(50000000)
];