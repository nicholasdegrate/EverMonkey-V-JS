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

                /* 
                    MONKEY PATCH TO GET THE @params: {INCLUDED}` DATA
                */
                fetch(`${url}/users/${userData.data.id}`)
                    .then(res => res.json())
                    .then(user => {
                        console.log(user)
                        // drops the DOM
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
    /* 
        destructing the user data
    */
    const { data, included } = user
    
    const profileImg = document.querySelector('.profile-img')
    const profileName = document.querySelector('.profile-name')
    const profileEmail = document.querySelector('.profile-email')

    /* 
        handling loop through the data of @params{INCLUDED}
    */
    allInclude(included)

    /* 
        get id for {data} = user
    */
    postNoteBook(data.id)
    
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

/*********************************
 * 
 *   handling loop through the data of @params{INCLUDED}
 * 
 *********************************/
const allInclude = (includeData) => {
    
    includeData.forEach(element => {
        /* 
            if true pass the note-books
        */
        getNoteBook(element)
    })
}


/*********************************
 * 
 *     Get the notbook name
 * 
 *********************************/
const noteBookContainer = document.querySelector('#notebook-container')

const getNoteBook = (include) => {

    if (include.type == 'note-books') {
        const noteBookItem = document.createElement('li')
        noteBookItem.dataset.id = include.id
        /* 
            adding texts into the li
        */
        noteBookItem.textContent = include.attributes.name
        /* 
            appending it back to ul
        */
        noteBookContainer.append(noteBookItem)
    }
    
    /* 
        this grabs the @params{include} 
    */
    clickNoteBook(include)
}

/*********************************
 * 
 *     Create a new notebook
 * 
*********************************/
const postNoteBook = (id) => {
    const title = document.querySelector('.notebook-title')
    const form = document.createElement('form')
    const leftBar = document.querySelector('div.left-bar')

    form.innerHTML = `<div class="field">
    <label class="label">NoteBook Name</label>
    <div class="control has-icons-left has-icons-right">
        <input class="input"  type="text" placeholder="notebook name" value="">
    </div>
        </div>
            <div class="control">
                <button class="button is-fullwidth is-link">Submit</button>
                  </div>`

    leftBar.append(form)

    form.addEventListener('submit', event => {
        event.preventDefault()
        const noteBookInput = event.target[0].value

        fetch('http://localhost:3000/api/v1/note_books', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: noteBookInput,user_id: parseInt(id)})
        })
            .then(response => response.json())
            .then(noteBookInput => console.log(noteBookInput))
            
    })
    getNoteBook(noteBookInput)
}

/*********************************
 * 
 *     Click notebook item to show notes on the right side
 * 
*********************************/
const noteContainer = document.querySelector('.notes-container')

const clickNoteBook = (notes) => {

    noteBookContainer.addEventListener('click', e => {

        if (e.target.matches('li')) {
        
            if (notes.type == 'notes') {
                const card = document.createElement('div')
                card.classList.add('card')
                card.dataset.id = notes.id

                card.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">
                            ${notes.attributes.name}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            ${notes.attributes.paragraph}
                            <br>
                            <time datetime="2016-1-1">${notes.attributes["updated-at"]}</time>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Save</a>
                        <a href="#" class="card-footer-item">Edit</a>
                        <a href="#" class="card-footer-item">Delete</a>
                    </footer>
                `
                noteContainer.append(card)
            }
        }
    })
}
/* 
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
document.write(today);
*/

/*********************************
 * 
 *     Get the notbook name
 * 
 *********************************/

main()