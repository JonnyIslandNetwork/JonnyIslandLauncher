// Work in progress
const { LoggerUtil } = require('helios-core')

const logger = LoggerUtil.getLogger('DiscordWrapper')

const { Client } = require('discord-rpc-patch')

const Lang = require('./langloader')

let client
let activity

exports.initRPC = function(genSettings, servSettings, initialDetails = Lang.queryJS('discord.waiting')){

    console.log(JSON.stringify(servSettings))
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: Lang.queryJS('discord.state', {shortId: servSettings.shortId}),
        largeImageKey: servSettings.largeImageKey,
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: false,
        buttons: [{label: 'Join us', url: 'https://jonnyisland.net'}, {label: 'Discord', url: 'https://discord.gg/uw6JWGFtAZ'}]
    }

    client.on('ready', () => {
        logger.info('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        hasRPC = false
        if(error.message.includes('ENOENT')) {
            logger.info('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.info('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateState = function(state){
    activity.state = state
    client.setActivity(activity)
    //logger.log('Updated discord state to: ' + state)
}

exports.clearState = function(){
    activity = {
        details: activity.details,
        largeImageKey: activity.largeImageKey,
        largeImageText: activity.largeImageText,
        startTimestamp: activity.startTimestamp,
        instance: activity.instance
    }
    client.setActivity(activity)
}

exports.clearDetails = function(){
    activity = {
        state: activity.state,
        largeImageKey: activity.largeImageKey,
        largeImageText: activity.largeImageText,
        startTimestamp: activity.startTimestamp,
        instance: activity.instance
    }
}

exports.resetTime = function(){
    activity.startTimestamp = new Date().getTime()
    client.setActivity(activity)
}

exports.getClient = function(){
    return client
}

exports.updateDetails = function(details){
    activity.details = details
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}