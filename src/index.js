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
const getNotes = document.querySelector('.notes')
const showNote = document.querySelector('.note-section-container')
const dashboardId = document.querySelector('#dashboard')
const modalUpdateNote = document.querySelector('.modal-update-note')

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
    const leftBar = document.querySelector('div.title-wrapper')


    title.addEventListener('click', e => {
        form.innerHTML = `
                <div class="field" style='margin-top: 2em;'>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input"  type="text" placeholder="add notebook" value="">
                    </div>
                </div>
                <div class="control">
                    <button class="button is-fullwidth is-link">Submit</button>
                </div>
                `
    
        if (form.style.display == 'block') {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
        }
        
        leftBar.append(form)
    })


    form.addEventListener('submit', e => {
        e.preventDefault()
        const name = e.target[0].value

        const noteBookObject = {
            name,
            user_id: parseInt(id),
            delete_object: false
        }

        e.target.reset()

        form.style.display = 'none'

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

    const exitBtn = document.querySelector('button.modal-close')
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
            paragraph: e.target[1].value,
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
                modalCreateNote.style.display = 'none'
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
                            ${newNote.data.attributes.paragraph.substring(0, 100) + '...'}
                            <br>
                            <div class='hidden-para' style='display: none;'>${newNote.data.attributes.paragraph}</div>
                        </div>
                            <time datetime="2016-1-1">${newNote.data.attributes["updated-at"].split('T')[0]}</time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item edit-button">Edit</a>
                        <a href="#" class="card-footer-item delete-button">Delete</a>
                    </footer>
                `
                noteContainer.prepend(card)
            })
    }
})

/*********************************
 * 
 *     EDIT NOTE
 * 
*********************************/
noteContainer.addEventListener('click', e => {

    if (e.target.matches('.card-content') || e.target.matches('.content')) {
        const parentCard = e.target.closest('div.card')
        const contentParagraph = parentCard.querySelector("div.card-content > .content > .hidden-para").textContent
        const authorTitle = parentCard.querySelector("p.card-header-title").textContent
        getNotes.querySelector('h2 > .notes-title').textContent = authorTitle.replace(/\s+/g, ' ').trim()
        getNotes.querySelector('.edit-paragraph').textContent = contentParagraph.replace(/\s+/g, ' ').trim()

        fetch(`${url}/notes/${parentCard.dataset.id}`)
            .then(res => res.json())
            .then(attachedFiles => {
                const { data, included } = attachedFiles
                const attachedFilesContainer = document.querySelector('.attached-files-container')
                const attachedFilesContainerUL = attachedFilesContainer.querySelector('ul')
                const attachedFilesButton = document.querySelector('.attach-files > h2')

                attachedFilesContainerUL.innerHTML = ''

                included.forEach(file => {
                    const li = document.createElement('li')
                    li.dataset.id = file.id
                    li.innerHTML = `
                            <div class="card">
                            <header class="card-header">
                            <p class="card-header-title">
                                ${file.attributes.name}
                            </p>
                            </header>
                            <p class="card-header-title">
                                ${file.attributes.file}
                            </p>
                        </div>
                    `
                    attachedFilesContainerUL.append(li)    
                })

                
            })
        const attachedFilesButton = document.querySelector('.attach-file-btn')
        attachedFilesButton.addEventListener('click', e => {
            const fileFormId = parentCard.dataset.id
            console.log(fileFormId)
            const modalPostFile = document.querySelector('.modal-attached-file')
            modalPostFile.style.display = 'block'

            modalPostFile.addEventListener('submit', e => {
                if (e.target.matches('.post-attached-files')) {
                    e.preventDefault()

                    console.log(e.target)
                }
            })
        })


    } else if (e.target.matches('.edit-button')) {
        //   paragraph name of note //submit button
        const form = document.querySelector('.update-notes')
        const noteId = e.target.closest("div.card").dataset.id
        form.dataset.id = noteId
        form.classList.add("edit-form-note")
        const noteContent = e.target.closest("div.card").querySelector("div.card-content > .content").textContent
        const noteTitle = e.target.closest('div.card').querySelector("p.card-header-title").textContent
        form.querySelector('input').value = noteTitle.replace(/\s+/g, ' ').trim()
        form.querySelector('textarea').textContent = noteContent.replace(/\s+/g, ' ').trim()
        
        modalUpdateNote.style.display = 'block'

        /* 
            doesnt work
        */
        const updateExitBtn = document.querySelector('button.modal-close')
        updateExitBtn.addEventListener('click', () => {
            console.log(e.target)
            modalUpdateNote.style.display = 'none'
        })

        const editForm = document.querySelector(".edit-form-note")
        editForm.addEventListener('submit', e => {
            e.preventDefault()
    
            const name = e.target[0].value
            const paragraph = e.target[1].value
            
            fetch(`${url}/notes/${parseInt(e.target.dataset.id)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, paragraph })
            })
                .then(response => response.json())
                .then(updatedNote => {
                    modalUpdateNote.style.display = 'none'
                    const currentCard = noteContainer.querySelector(`div[data-id='${e.target.dataset.id}']`)
                    const currenttitle = currentCard.querySelector('p.card-header-title')
                    const currentPara = currentCard.querySelector('.content')
                    currenttitle.textContent = updatedNote.data.attributes.name
                    currentPara.textContent = updatedNote.data.attributes.paragraph
                })
            })
    /*********************************
     * 
     *     DELETE NOTE
     * 
    *********************************/
    } else if (e.target.matches('.delete-button')) {
        const noteId = e.target.closest("div.card").dataset.id
        fetch(`${url}/notes/${noteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ delete_object: true })
        })
            .then(res => res.json())
            .then(deleteNote => e.target.closest('div.card').remove())
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
                ${note.attributes.paragraph.substring(0, 150)  + '...'}
                <br>
                <div class='hidden-para' style='display: none;'>${note.attributes.paragraph}</div>
            </div>
                <time datetime="2016-1-1">${note.attributes["updated-at"].split('T')[0]}</time>
        </div>
        <footer class="card-footer">
            <a href="#" class="card-footer-item edit-button">Edit</a>
            <a href="#" class="card-footer-item delete-button">Delete</a>
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
/*********************************
 * 
 *     get attached files
 * 
*********************************/
/* 
    edit the page
*/
getNotes.contentEditable = 'true'; getNotes.designMode='on'; void 0


main()