/*********************************
 * 
 *   index.js is the main application for initalizing all file
 * 
*********************************/

// declared all global variables
const mainWrapper = document.querySelector('#main-wrapper');
const loginPage = document.querySelector('#login-page');
const dashboardPage = document.querySelector('#dashboard');
const noteBookContainer = document.querySelector('#notebook-container');
const noteContainer = document.querySelector('.notes-container');
const createNoteButton = document.querySelector('.create-note-btn');
const modalCreateNote = document.querySelector('.modal-create-note');
const postNoteForm = document.querySelector('.create-notes');
const getNotes = document.querySelector('.notes');
const showNote = document.querySelector('.note-section-container');
const dashboardId = document.querySelector('#dashboard');
const modalUpdateNote = document.querySelector('.modal-update-note');
const searchBar = document.querySelector('.searchbar');

const url = 'http://localhost:3000/api/v1';

/*********************************
 * 
 *  INIT WHEN DOMCONTENTLOADED
 * 
*********************************/
const main = () => {
	renderLogin();
};
/*********************************
 * 
 *  RENDER LOGIN PAGE
 * 
*********************************/
const renderLogin = () => {
	submitUserForm();
};
/*********************************
 * 
 *  SUBMIT USER TO FORM
 * 
*********************************/
const submitUserForm = () => {
	const userForm = document.querySelector('#login-page > form');

	userForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const newUser = {
			username: e.target[0].value,
			email: e.target[1].value,
		};

		e.target.reset();

		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify(newUser)
		};

		fetch(`${url}/users`, config)
			.then((res) => res.json())
			.then((userData) => {
				/* 
                    MONKEY PATCH TO GET THE @params: {INCLUDED}` DATA
                */
				fetch(`${url}/users/${userData.data.id}`).then((res) => res.json()).then((user) => {
					// drops the DOM
					loginPage.style.display = 'none';
					dashboardPage.style.display = 'block';
					dashboardPage.dataset.id = user.data.id;

					// return dashboard
					dashboard(user);
				});
			})
			.catch((err) => console.log(err));
	});
};

/*********************************
 * 
 *  DASHBOARD PAGE
 * 
 *********************************/
const dashboard = (user) => {
	/* 
        destructing the user data
    */
	const { data, included } = user;

	const profileImg = document.querySelector('.profile-img');
	const profileName = document.querySelector('.profile-name');
	const profileEmail = document.querySelector('.profile-email');

	/* 
        handling loop through the data of @params{INCLUDED}
    */
	getAllNoteBooks(included);

	/* 
        get id for {data} = user
    */
	postNoteBook(data.id);

	/* 
        launch the profile character
    */
	if (dashboardPage.style.display === 'block') {
		const modal = document.createElement('div');
		modal.innerHTML = `
	    <div class="modal is-active is-clipped">
	        <div class="modal-background"></div>
            <div class="modal-content" style='height: 70vh; width: 450px;background: #fff; display: flex; justify-content: center; align-items: center; border-radius: 5px;'>
            <form class='character-picker' style='width: 90%;'>
            <div class="control">
            <div class='image-picker' style='margin-bottom: 4em;'>
              <label class="radio">
              <li style='
              margin-top: -2px;
              margin-right: 15px;
              background: rgb(243, 239, 183);
              width: 50px;
              height: 50px;
              border-radius: 10px;
              padding: 10px;
              '>
              <img class='profile-img' src="./public/cat.svg" width="112" height="28" />
          </li>
                <input type="radio" name="cat" value='0'>
              </label>
              <label class="radio">
              <li style='
              margin-top: -2px;
              margin-right: 15px;
              background: rgb(243, 239, 183);
              width: 50px;
              height: 50px;
              border-radius: 10px;
              padding: 10px;
              '>
              <img class='profile-img' src="./public/hen.svg" width="112" height="28" />
          </li>
                <input type="radio" name="character" value='1'>
              </label>
              <label class="radio">
              <li style='
              margin-top: -2px;
              margin-right: 15px;
              background: rgb(243, 239, 183);
              width: 50px;
              height: 50px;
              border-radius: 10px;
              padding: 10px;
              '>
              <img class='profile-img' src="./public/monkey.svg" width="112" height="28" />
          </li>
                <input type="radio" name="character" value='2'>
              </label>
              <label class="radio">
              <li style='
              margin-top: -2px;
              margin-right: 15px;
              background: rgb(243, 239, 183);
              width: 50px;
              height: 50px;
              border-radius: 10px;
              padding: 10px;
              '>
              <img class='profile-img' src="./public/panda-bear.svg" width="112" height="28" />
          </li>
              <input type="radio" name="character" value='3'>
            </label>
            <label class="radio">
            <li style='
            margin-top: -2px;
            margin-right: 15px;
            background: rgb(243, 239, 183);
            width: 50px;
            height: 50px;
            border-radius: 10px;
            padding: 10px;
            '>
            <img class='profile-img' src="./public/pig.svg" width="112" height="28" />
        </li>
            <input type="radio" name="character" value='4'>
          </label>
          <label class="radio">
          <li style='
          margin-top: -2px;
          margin-right: 15px;
          background: rgb(243, 239, 183);
          width: 50px;
          height: 50px;
          border-radius: 10px;
          padding: 10px;
          '>
          <img class='profile-img' src="./public/sheep.svg" width="112" height="28" />
      </li>
          <input type="radio" name="character" value='5'>
        </label>
        </div>
            </div>
                <div class="control">
                    <button class="button is-fullwidth is-link">Submit</button>
                </div>

            </form>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
	    </div>
	    `;

		dashboardPage.append(modal);

		const exitBtn = modal.querySelector('button');
		exitBtn.addEventListener('click', () => {
			return (modal.className = 'modal');
		});
    }
    
    const characterForm = document.querySelector('.character-picker')

    characterForm.addEventListener('submit', e => {
        e.preventDefault();

        const profileImage = document.querySelector('.profile-img')

        let result; 

        const input = characterForm.querySelector('input[name=character]:checked')

        const character = {
            0: 'cat.svg',
            1: 'hen.svg',
            2: 'monkey.svg',
            3: 'panda-bear.svg',
            4: 'pig.svg',
            5: 'sheep.svg'
        }

        for (const [key, value] in character) {
            if (key == input.value) result = character[key]
        }
        
        profileImage.src = `./public/${result}`
        fetch(`${url}/users/${dashboardId.dataset.id}`, {
            method: 'PATCH',
            header: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({profile_image: String(result)})
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))



    })

	profileName.textContent = data.attributes.username;
	profileEmail.textContent = data.attributes.email;
};

/*********************************
 * 
 *   handling loop through the data of @params{INCLUDED}
 * 
 *********************************/
const getAllNoteBooks = (includeData) => {
	includeData.forEach((element) => {
		/* 
            if true pass the note-books
        */
		getNoteBook(element);
	});
};

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
		const noteBookItem = document.createElement('li');
		noteBookItem.dataset.id = include.id;
		/* 
            adding texts into the li
        */
		noteBookItem.textContent = include.attributes.name;
		/* 
            appending it back to ul
        */
		noteBookContainer.append(noteBookItem);
	}

	/* 
        this grabs the @params{include} 
    */
	// clickNoteBook(include)
};

/*********************************
 * 
 *     Create a new notebook
 * 
*********************************/
const postNoteBook = (id) => {
	const title = document.querySelector('.notebook-title');
	const form = document.createElement('form');
	const leftBar = document.querySelector('div.title-wrapper');

	title.addEventListener('click', (e) => {
		form.innerHTML = `
                <div class="field" style='margin-top: 2em;'>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input"  type="text" placeholder="add notebook" value="">
                    </div>
                </div>
                <div class="control">
                    <button class="button is-fullwidth is-link">Submit</button>
                </div>
                `;

		if (form.style.display == 'block') {
			form.style.display = 'none';
		} else {
			form.style.display = 'block';
		}

		leftBar.append(form);
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = e.target[0].value;

		const noteBookObject = {
			name,
			user_id: parseInt(id),
			delete_object: false
		};

		e.target.reset();

		form.style.display = 'none';

		fetch('http://localhost:3000/api/v1/note_books', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(noteBookObject)
		})
			.then((response) => response.json())
			.then((newNoteBook) => {
				const noteBookItem = document.createElement('li');
				noteBookItem.dataset.id = newNoteBook.data.id;
				/* 
                    adding texts into the li
                */
				noteBookItem.textContent = newNoteBook.data.attributes.name;
				/* 
                    appending it back to ul
                */
				noteBookContainer.append(noteBookItem);
			});
	});
};

/*********************************
 * 
 *     Click notebook item to show notes on the right side
 * 
*********************************/
noteBookContainer.addEventListener('click', (e) => {
	if (e.target.matches('li')) {
		const id = e.target.dataset.id;
		/* 
            if clicked display create a note
        */
		createNoteButton.style.display = 'block';
		createNoteButton.dataset.id = parseInt(id);

		noteContainer.innerHTML = '';

		fetch(`${url}/note_books/${id}`).then((res) => res.json()).then((singleNoteBook) => {
			const { data, included } = singleNoteBook;
			getAllNotes(included);
		});
	}
});

/*********************************
 * 
 *     post notes
 * 
*********************************/
createNoteButton.addEventListener('click', (e) => {
	const noteId = createNoteButton.dataset.id;
	modalCreateNote.style.display = 'block';
	modalCreateNote.dataset.id = parseInt(noteId);

	const exitBtn = document.querySelector('button.modal-close');
	exitBtn.addEventListener('click', () => {
		return (modalCreateNote.style.display = 'none');
	});
});

/*********************************
 * 
 *     postNote form listener
 * 
*********************************/
modalCreateNote.addEventListener('submit', (e) => {
	if (e.target.matches('form')) {
		e.preventDefault();
		const formId = modalCreateNote.dataset.id;
		const noteObject = {
			name: e.target[0].value,
			paragraph: e.target[1].value,
			note_book_id: parseInt(formId),
			delete_object: false
		};

		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify(noteObject)
		};

		e.target.reset();

		fetch(`${url}/notes`, config).then((res) => res.json()).then((newNote) => {
			modalCreateNote.style.display = 'none';
			const card = document.createElement('div');
			card.classList.add('card');
			card.dataset.id = newNote.data.id;

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
                            </div>
                            <div class='hidden-para' style='display: none;'>${newNote.data.attributes.paragraph}</div>
                            <time datetime="2016-1-1">${newNote.data.attributes['updated-at'].split('T')[0]}</time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item edit-button">Edit</a>
                        <a href="#" class="card-footer-item delete-button">Delete</a>
                    </footer>
                `;
			noteContainer.prepend(card);
		});
	}
});

/*********************************
 * 
 *   show note on right side
 * 
*********************************/
noteContainer.addEventListener('click', (e) => {
	if (e.target.matches('.card-content') || e.target.matches('.content')) {
		const parentCard = e.target.closest('div.card');
		const contentParagraph = parentCard.querySelector('.hidden-para').textContent;
		const authorTitle = parentCard.querySelector('p.card-header-title').textContent;
		getNotes.querySelector('h2 > .notes-title').textContent = authorTitle.replace(/\s+/g, ' ').trim();
		getNotes.querySelector('.edit-paragraph').textContent = contentParagraph.replace(/\s+/g, ' ').trim();

		fetch(`${url}/notes/${parentCard.dataset.id}`).then((res) => res.json()).then((attachedFiles) => {
			const { data, included } = attachedFiles;
			const attachedFilesContainer = document.querySelector('.attached-files-container');
			const attachedFilesContainerUL = attachedFilesContainer.querySelector('ul');

			attachedFilesContainerUL.innerHTML = '';

			included.forEach((file) => {
				const li = document.createElement('li');
				li.dataset.id = file.id;
				li.innerHTML = `
                            <div style='
                            padding: .5em;
                            box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);
                            border-radius: 5px;
                            margin-top: 1em;
                            '>
                            <header class="card-header">
                            <p style='padding: .5em; font-weight: bold; '>
                                ${file.attributes.name}
                            </p>
                            </header>
                            <p  style='font-size: 14px; font-weight: normal !important;  padding: .5em;'>
                                ${file.attributes.file}
                            </p>
                        </div>
                    `;
				attachedFilesContainerUL.append(li);
			});
		});
		const attachedFilesButton = document.querySelector('.attach-file-btn');
		attachedFilesButton.addEventListener('click', (e) => {
			const fileFormId = parentCard.dataset.id;
			const modalPostFile = document.querySelector('.modal-attached-file');
			modalPostFile.style.display = 'block';

			modalPostFile.addEventListener('submit', (e) => {
				if (e.target.matches('.post-attached-files')) {
					e.preventDefault();

					const fileObj = {
						name: e.target[0].value,
						file: e.target[1].value,
						note_id: parseInt(fileFormId)
					};

					e.target.reset();
					fetch(`${url}/attached_files`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(fileObj)
					})
						.then((res) => res.json())
						.then((file) => {
							console.log(file);
							modalPostFile.style.display = 'none';
							const attachedFilesContainer = document.querySelector('.attached-files-container');
							const attachedFilesContainerUL = attachedFilesContainer.querySelector('ul');
							const li = document.createElement('li');
							li.dataset.id = file.id;
							li.innerHTML = `
                                    <div
                                    style='
                                    padding: .5em;
                                    box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);
                                    border-radius: 5px;
                                    margin-top: 1em;
                                    '
                                    >
                                    <header class="card-header">
                                    <p class="card-header-title">
                                        ${file.data.attributes.name}
                                    </p>
                                    </header>
                                    <p style='font-size: 14px; font-weight: normal !important; padding: .5em;'>
                                        ${file.data.attributes.file}
                                    </p>
                                    </div>
                            `;
							attachedFilesContainerUL.append(li);
						});
				}
			});
		});
	} else if (e.target.matches('.edit-button')) {
		//   paragraph name of note //submit button
		const form = document.querySelector('.update-notes');
		const noteId = e.target.closest('div.card').dataset.id;
		form.dataset.id = noteId;
		form.classList.add('edit-form-note');
		const noteContent = e.target.closest('div.card').querySelector('.hidden-para').textContent;
		const noteTitle = e.target.closest('div.card').querySelector('p.card-header-title').textContent;
		form.querySelector('input').value = noteTitle.replace(/\s+/g, ' ').trim();
		form.querySelector('textarea').textContent = noteContent.replace(/\s+/g, ' ').trim();

		modalUpdateNote.style.display = 'block';

		/* 
            doesnt work
        */
		const updateExitBtn = document.querySelector('button.modal-close');
		updateExitBtn.addEventListener('click', () => {
			console.log(e.target);
			modalUpdateNote.style.display = 'none';
		});

		const editForm = document.querySelector('.edit-form-note');
		editForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const name = e.target[0].value;
			const paragraph = e.target[1].value;

			fetch(`${url}/notes/${parseInt(e.target.dataset.id)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, paragraph })
			})
				.then((response) => response.json())
				.then((updatedNote) => {
					modalUpdateNote.style.display = 'none';
					const currentCard = noteContainer.querySelector(`div[data-id='${e.target.dataset.id}']`);
					const currenttitle = currentCard.querySelector('p.card-header-title');
					const hiddenPara = currentCard.querySelector('.hidden-para');
					const currentPara = currentCard.querySelector('.content');
					currenttitle.textContent = updatedNote.data.attributes.name;
					currentPara.textContent = updatedNote.data.attributes.paragraph.replace(/\s+/g, ' ').trim();
					hiddenPara.textContent = updatedNote.data.attributes.paragraph;
					console.log(p);
				});
		});
		/*********************************
     * 
     *     DELETE NOTE
     * 
    *********************************/
	} else if (e.target.matches('.delete-button')) {
		const noteId = e.target.closest('div.card').dataset.id;
		fetch(`${url}/notes/${noteId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ delete_object: true })
		})
			.then((res) => res.json())
			.then((deleteNote) => e.target.closest('div.card').remove());
	}
});
/*********************************
 * 
 *     Render note after presist
 * 
*********************************/
const renderNote = (note) => {
	const card = document.createElement('div');
	card.classList.add('card');
	card.dataset.id = note.id;

	card.innerHTML = `
        <header class="card-header">
            <p class="card-header-title">
                ${note.attributes.name}
            </p>
        </header>
        <div class="card-content">
            <div class="content">
                ${note.attributes.paragraph.substring(0, 150) + '...'}
                <br>
                </div>
                <div class='hidden-para' style='display: none;'>${note.attributes.paragraph}</div>
                <time datetime="2016-1-1">${note.attributes['updated-at'].split('T')[0]}</time>
        </div>
        <footer class="card-footer">
        <a href="#" class="card-footer-item edit-button">Edit</a>
        <a href="#" class="card-footer-item delete-button">Delete</a>
        </footer>
    `;
	noteContainer.append(card);
};

/*********************************
 * 
 *     Get the notes
 * 
*********************************/
const getAllNotes = (allNotes) => {
	allNotes.forEach((note) => {
		if (note.attributes['delete-object'] == false) {
			renderNote(note);
		}
	});
};
/*********************************
 * 
 *     get attached files
 * 
*********************************/
/* 
    edit the page
*/
getNotes.contentEditable = 'true';
getNotes.designMode = 'on';
void 0;
/*********************************
 * 
 *     delete trashcan
 * 
*********************************/
const trashCanButton = document.querySelector('.trash-can-button');
trashCanButton.addEventListener('click', (event) => {
	noteContainer.innerHTML = '';
	fetch(`${url}/users/${dashboardId.dataset.id}`).then((res) => res.json()).then((user) => {
		const { data, included } = user;
		included.forEach((note) => {
			if (note.type == 'notes' && note.attributes['delete-object'] == true) {
				const card = document.createElement('div');
				card.classList.add('card');
				card.dataset.id = note.id;
				card.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">
                            ${note.attributes.name}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            ${note.attributes.paragraph.substring(0, 100) + '...'}
                            <br>
                            </div>
                            <div class='hidden-para' style='display: none;'>${note.attributes.paragraph}</div>
                            <time datetime="2016-1-1">${note.attributes['updated-at'].split('T')[0]}</time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" style='background: #C21E56; color: #fff !important;' class="card-footer-item final-delete-button">Delete</a>
                    </footer>
                `;
				noteContainer.prepend(card);
			}
		});
		noteContainer.addEventListener('click', (event) => {
			if (event.target.matches('.final-delete-button')) {
				const trashCanCard = event.target.closest('.card');
				trashCanCard.remove();
				console.log(trashCanCard.dataset.id);
				fetch(`${url}/notes/${trashCanCard.dataset.id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then((response) => response.json())
					.then((data) => console.log(data));
			}
		});
	});
});

/*********************************
 * 
 *     search bar 
 * 
*********************************/
const search = () => {
	let input = searchBar.querySelector('input').value;

	input = input.toLowerCase();

	let allCard = noteContainer.querySelectorAll('.card');
	for (let i = 0; i < allCard.length; i++) {
		const cardValue = String(allCard[i].querySelector('.card-header-title').innerText.replace(/\s+/g, ' ').trim());

		if (!cardValue.toLowerCase().includes(input)) {
			allCard[i].style.display = 'none';
		} else {
			allCard[i].style.display = 'block';
		}
	}
};

/*********************************
 * 
 *     calendar
 * 
 *********************************/
function generate_year_range(start, end) {
	var years = '';
	for (var year = start; year <= end; year++) {
		years += "<option value='" + year + "'>" + year + '</option>';
	}
	return years;
}

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById('year');
selectMonth = document.getElementById('month');

createYear = generate_year_range(1970, 2050);
/** or
 * createYear = generate_year_range( 1970, currentYear );
 */

document.getElementById('year').innerHTML = createYear;

var calendar = document.getElementById('calendar');
var lang = calendar.getAttribute('data-lang');

var months = '';
var days = '';

var monthDefault = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

var dayDefault = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

if (lang == 'en') {
	months = monthDefault;
	days = dayDefault;
} else if (lang == 'id') {
	months = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];
	days = [ 'Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab' ];
} else if (lang == 'fr') {
	months = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	];
	days = [ 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi' ];
} else {
	months = monthDefault;
	days = dayDefault;
}

var $dataHead = '<tr>';
for (dhead in days) {
	$dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + '</th>';
}
$dataHead += '</tr>';

//alert($dataHead);
document.getElementById('thead-month').innerHTML = $dataHead;

monthAndYear = document.getElementById('monthAndYear');
showCalendar(currentMonth, currentYear);

function next() {
	currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
	currentMonth = (currentMonth + 1) % 12;
	showCalendar(currentMonth, currentYear);
}

function previous() {
	currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
	currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
	showCalendar(currentMonth, currentYear);
}

function jump() {
	currentYear = parseInt(selectYear.value);
	currentMonth = parseInt(selectMonth.value);
	showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
	var firstDay = new Date(year, month).getDay();

	tbl = document.getElementById('calendar-body');

	tbl.innerHTML = '';

	monthAndYear.innerHTML = months[month] + ' ' + year;
	selectYear.value = year;
	selectMonth.value = month;

	// creating all cells
	var date = 1;
	for (var i = 0; i < 6; i++) {
		var row = document.createElement('tr');

		for (var j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				cell = document.createElement('td');
				cellText = document.createTextNode('');
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth(month, year)) {
				break;
			} else {
				cell = document.createElement('td');
				cell.setAttribute('data-date', date);
				cell.setAttribute('data-month', month + 1);
				cell.setAttribute('data-year', year);
				cell.setAttribute('data-month_name', months[month]);
				cell.className = 'date-picker';
				cell.innerHTML = '<span>' + date + '</span>';

				if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
					cell.className = 'date-picker selected';
				}
				row.appendChild(cell);
				date++;
			}
		}

		tbl.appendChild(row);
	}
}

function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

main();
