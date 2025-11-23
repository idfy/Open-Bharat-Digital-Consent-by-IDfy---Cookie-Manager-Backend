function getHomePage(req, res) {
    try {
        return res.status(200).render('home')
    } catch (error) {
        console.log('error: ', error)
        return res.status(500).send('error getting tags')
    }
}

function getUserDetails(req, res) {
    try {
        return res.status(200).render('getIds')
    } catch (error) {
        console.log('error: ', error)
        return res.status(500).send('error getting user details')
    }
}

function health(req, res) {
    return res.status(200).json({
        message: 'Success'
    })
}

export { getHomePage, getUserDetails, health }
