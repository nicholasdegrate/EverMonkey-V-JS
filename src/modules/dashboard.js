export const dashboard = (main, user) => {

    const dashboardContainer = document.createElement('div')
    dashboardContainer.innerHTML = `${user.data.attributes.username}`
    main.append(dashboardContainer)
}

