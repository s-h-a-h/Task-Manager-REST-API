const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/userModel')
const auth = require('../middleware/authorization')
const { welcomeEmailToUser, cancelationEmailToUser } = require('../services/emailService')
const router = new express.Router()

// Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        welcomeEmailToUser(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByUserCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthorizationToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

// Logout user's current session.
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Logout user from all the devices.
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Fetch user profile.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//Update user profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const updatesAllowed = ['name', 'email', 'password', 'age']
    const isValidUpdates = updates.every((update) => updatesAllowed.includes(update))

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete user.
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        cancelationEmailToUser(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Upload image function.
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Image not found!'))
        }

        cb(undefined, true)
    }
})

// Upload user's avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//Delete user's avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Display user's avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router