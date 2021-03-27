import {dashboard} from './dashboard.js'
import { url, mainWrapper } from '../index.js'
/*
    init the login
*/
const renderLogin = () => {
    const loginForm = document.createElement('form')
    loginForm.classList.add('login-form')
    const flex = document.createElement('div')
    flex.classList.add('flex-login')


    loginForm.innerHTML = `
    <div class="field">
        <label class="label">Username</label>
        <div class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="username" value="">
            <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
            </span>
            <span class="icon is-small is-right">
               <!-- <i class="fas fa-check"></i> -->
            </span>
        </div>
    </div>
  
    <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left has-icons-right">
            <input class="input " type="email" placeholder="email" value="">
            <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
            </span>
            <span class="icon is-small is-right">
            <!--<i class="fas fa-exclamation-triangle"></i> -->
            </span>
        </div>
        <!-- <p class="help is-danger">This email is invalid</p>-->
    </div>


    <div class="control">
        <button class="button is-fullwidth is-link">Submit</button>
    </div>
    `

    flex.appendChild(loginForm)
    mainWrapper.appendChild(flex)

    /* 
        logs in a user
    */
    submitUserForm()
}

const submitUserForm = () => {
    const userForm = document.querySelector('.login-form')
    
    userForm.addEventListener('submit', e => {
        e.preventDefault()

        const newUser = {
            username: e.target[0].value,
            email: e.target[1].value,
            profile_image: ''
        }

        e.target.reset()

        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true 
            }, body: JSON.stringify(newUser)
        }

        fetch(`${url}/users`, config)
            .then(res => res.json())
            .then(user => {
                console.log(user)

                // clearing DOM
                mainWrapper.innerHTML = ''

                // dashboard
                dashboard(mainWrapper, user)
            })
            .catch(err => console.log(err))
    })
}


export default renderLogin