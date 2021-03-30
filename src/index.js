/*********************************
 * 
 *   index.js is the main application for initalizing all file
 * 
*********************************/

// declared all global variables
const mainWrapper = document.querySelector('#main-wrapper')
const loginPage = document.querySelector('#login-page')
const dashboardPage = document.querySelector('#dashboard')
const noteBookContainer = document.querySelector('#notebook-container')
const noteContainer = document.querySelector('.notes-container')
const createNoteButton = document.querySelector('.create-note-btn')
const modalCreateNote = document.querySelector('.modal-create-note')
const postNoteForm = document.querySelector('.create-notes')

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
    getAllNoteBooks(included)

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
const getAllNoteBooks = (includeData) => {
    
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
/* 
    this is correctly not working
*/
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
    // clickNoteBook(include)
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

    form.innerHTML = `
            <div class="field">
                <label class="label">NoteBook Name</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input"  type="text" placeholder="notebook name" value="">
                </div>
            </div>
            <div class="control">
                <button class="button is-fullwidth is-link">Submit</button>
            </div>
            `

    leftBar.append(form)

    form.addEventListener('submit', e => {
        e.preventDefault()
        const name = e.target[0].value

        const noteBookObject = {
            name,
            user_id: parseInt(id),
            delete_object: false
        }

        e.target.reset()

        fetch('http://localhost:3000/api/v1/note_books', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(noteBookObject)
        })
        .then(response => response.json())
        .then(newNoteBook => {

                const noteBookItem = document.createElement('li')
                noteBookItem.dataset.id = newNoteBook.data.id
                /* 
                    adding texts into the li
                */
                noteBookItem.textContent = newNoteBook.data.attributes.name
                /* 
                    appending it back to ul
                */
                noteBookContainer.append(noteBookItem)
        })
            
    })
}

/*********************************
 * 
 *     Click notebook item to show notes on the right side
 * 
*********************************/
noteBookContainer.addEventListener('click', e => {
    if (e.target.matches('li')) {
        
        const id = e.target.dataset.id
        /* 
            if clicked display create a note
        */
        createNoteButton.style.display = 'block'
        createNoteButton.dataset.id = parseInt(id)

        noteContainer.innerHTML = ''

        fetch(`${url}/note_books/${id}`)
            .then(res => res.json())
            .then(singleNoteBook => {
                const { data, included } = singleNoteBook
                getAllNotes(included)
            })
    }
})


/*********************************
 * 
 *     post notes
 * 
*********************************/
createNoteButton.addEventListener('click', e => {

    const noteId = createNoteButton.dataset.id
    modalCreateNote.style.display = 'block'
    modalCreateNote.dataset.id = parseInt(noteId)

    const exitBtn = modalCreateNote.querySelector('button')
    exitBtn.addEventListener('click', () => {
        return modalCreateNote.style.display = 'none'
    })
})

    

/*********************************
 * 
 *     postNote form listener
 * 
*********************************/
modalCreateNote.addEventListener('submit', e => {
    if (e.target.matches('form')) {
        e.preventDefault()
        const formId = modalCreateNote.dataset.id
        const noteObject = {
            name: e.target[0].value,
            paragraph: e.target[0].value,
            note_book_id: parseInt(formId),
            delete_object: false
        }


        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true 
            }, body: JSON.stringify(noteObject)
        }

        e.target.reset()

        fetch(`${url}/notes`, config)
            .then(res => res.json())
            .then(newNote => {
                const card = document.createElement('div')
                card.classList.add('card')
                card.dataset.id = newNote.data.id
            
                card.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">
                            ${newNote.data.attributes.name}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            ${newNote.data.attributes.paragraph}
                            <br>
                            <time datetime="2016-1-1">${newNote.data.attributes["updated-at"]}</time>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Save</a>
                        <a href="#" class="card-footer-item">Edit</a>
                        <a href="#" class="card-footer-item">Delete</a>
                    </footer>
                `
                noteContainer.prepend(card)
            })
    }
})
/*********************************
 * 
 *     Render note after presist
 * 
*********************************/
const renderNote = (note) => {
    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.id = note.id

    card.innerHTML = `
        <header class="card-header">
            <p class="card-header-title">
                ${note.attributes.name}
            </p>
        </header>
        <div class="card-content">
            <div class="content">
                ${note.attributes.paragraph}
                <br>
                <time datetime="2016-1-1">${note.attributes["updated-at"]}</time>
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

/*********************************
 * 
 *     Get the notes
 * 
*********************************/
const getAllNotes = (allNotes) => {
    allNotes.forEach(note => {
        renderNote(note)
    })
}

main()