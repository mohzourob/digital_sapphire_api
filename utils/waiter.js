const wait = (timeInSeconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeInSeconds)
    })
}


export default wait;