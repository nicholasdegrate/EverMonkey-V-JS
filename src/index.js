/*
    index.js is the main application for initalizing all files
*/
// import renderLogin from './modules/login.js'
// import {dashboard} from './modules/dashboard'
// declared all global variables
export const mainWrapper = document.querySelector('#main-wrapper')
export const url = 'http://localhost:3000/api/v1'

// init on DOMContentLoaded
const main = () => {
    dashboard(mainWrapper)
    // renderLogin()
}

const dashboard = (main) => {
    const dashboardContainer = document.createElement('div')
    
    dashboardContainer.innerHTML = `
        <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/" style='margin-left: -50px; margin-right: 60px;'>
                <img src="../../public/monkey.svg" width="142" height="28">
                <h1 style='margin-left: -2em;'>EverMonkey</h1>
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item">
                    <input class="input" type="text" placeholder="search">
                </div>

                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-warning is-fullwidth" style="color: #fff;">
                            create a note
                        </a>
                    </div>
                </div>

            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <ul style='display: flex; '>
                        <li style='
                            margin-top: -2px;
                            margin-right: 15px;
                            background: rgb(243, 239, 183);
                            width: 50px;
                            height: 50px;
                            border-radius: 10px;
                            padding: 10px;
                            '>
                            <img
                                src="../../public/monkey.svg"
                                width="112"
                                height="28"
                                />
                        </li>
                        <div>
                            <li style='font-weight: bold;'>Nicholas</li>
                            <li style='font-size: 12px;'>nicholasdegrate@gmail.com</li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
        </nav>
        <div class='main'>
            <div class='left-bar'></div>
            <div class='notes-container'>
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Component
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                            <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                            <br>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Save</a>
                        <a href="#" class="card-footer-item">Edit</a>
                        <a href="#" class="card-footer-item">Delete</a>
                    </footer>
                </div>
            

            </div>
            <div
                class='note-section-container'
            >
                <div class='notes'>
                    <h3>title</h3>
                    <textarea class="textarea" placeholder="10 lines of textarea" rows="10" column='40'></textarea>
                </div>
                <div class='right-bar'></div>
            </div>
        </div>

    `
    
    main.append(dashboardContainer)
}

main()