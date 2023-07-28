/**
 * Script for welcome.ejs
 */
document.getElementById('welcomeButton').addEventListener('click', e => {
    loginOptionsCancelEnabled(false) // False by default, be explicit.
    loginOptionsViewOnLoginSuccess = VIEWS.landing
    loginOptionsViewOnLoginCancel = VIEWS.loginOptions
    document.getElementById('frameBar').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    switchView(VIEWS.welcome, VIEWS.loginOptions)
})