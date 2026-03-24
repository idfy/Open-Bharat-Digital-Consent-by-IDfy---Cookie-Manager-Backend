/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 * 
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 * 
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

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
