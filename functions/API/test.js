exports.testFunc = (number) => {
    if (Number.isInteger(number)) {
        console.log("HI")
    } else {
        throw new TypeError()
    }
}