/*
    index.js is the main application for initalizing all files
*/
import {renderLogin} from './modules/login.js'
// declared all global variables
export const mainWrapper = document.querySelector('#main-wrapper')
export const url = 'http://localhost:3000/api/v1'


// init on DOMContentLoaded
const main = () => {
    renderLogin(mainWrapper)
}


main()