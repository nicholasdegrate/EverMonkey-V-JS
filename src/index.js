/* 
    index.js is the main application for initalizing all files
*/

// declared all global variables
const mainWrapper = document.querySelector('#main-wrapper')

// init on DOMContentLoaded
const main = () => {
    login()
}

/* 
    init the login
*/
const login = () => {
    const loginForm = document.createElement('form')
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
}

main()