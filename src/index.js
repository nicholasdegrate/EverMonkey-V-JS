/*********************************
 * 
 *   index.js is the main application for initalizing all file
 * 
*********************************/

// declared all global variables
const mainWrapper = document.querySelector('#main-wrapper')
const loginPage = document.querySelector('#login-page')
const dashboardPage = document.querySelector('#dashboard')

const url = 'http://localhost:3000/api/v1'


/*********************************
 * 
 *  INIT WHEN DOMCONTENTLOADED
 * 
*********************************/
const main = () => {
    renderLogin()
}

/*********************************
 * 
 *  RENDER LOGIN PAGE
 * 
*********************************/
const renderLogin = () => {
    submitUserForm()
}


/*********************************
 * 
 *  SUBMIT USER TO FORM
 * 
*********************************/
const submitUserForm = () => {
    const userForm = document.querySelector("#login-page > form")

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
            .then(userData => {
                console.log(userData)

                fetch(`${url}/users/${userData.data.id}`)
                    .then(res => res.json())
                    .then(user => {
                        console.log(user)
                        loginPage.style.display = 'none'
                        dashboardPage.style.display = 'block'
                        dashboardPage.dataset.id = user.data.id
                        // return dashboard
                        dashboard(user)
                    })
            })
            .catch(err => console.log(err))
    })
}


/*********************************
 * 
 *  DASHBOARD PAGE
 * 
 *********************************/
const dashboard = (user) => {
    const { data } = user
    

    const profileImg = document.querySelector('.profile-img')
    const profileName = document.querySelector('.profile-name')
    const profileEmail = document.querySelector('.profile-email')
    const noteBookContainer = document.querySelector('#notebook-container')


  
    /* 
        launch the profile character
    */
    // if (dashboardPage.style.display === 'block') {
    //     const modal = document.createElement('div')
    //     modal.innerHTML = `
    //     <div class="modal is-active is-clipped">
    //         <div class="modal-background"></div>
    //         <div class="modal-content">
    //             hello
    //         </div>
    //         <button class="modal-close is-large" aria-label="close"></button>
    //     </div> 
    //     `
        
        
    //     dashboardPage.append(modal)
        
        
    //     const exitBtn = modal.querySelector('button')
    //     exitBtn.addEventListener('click', () => {
    //        return modal.className = 'modal'
    //     })
    // }
    

    profileName.textContent = data.attributes.username
    profileEmail.textContent = data.attributes.email

}




main()