import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

console.log('Let\'s go!');
let token = null
let userID = null
let currentChannelID = null
let currentChannelName = null
let currentMsgID = null
let currentMsg = null
let selectedUsers = []


// makeRequest is from the lecture code week 5
const makeRequest = (route, method, body) => {
    const options = {
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }, 
    }
    if (body !== undefined) {
        options.body = JSON.stringify(body)
    }
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5005' + route, options).then((rawresponse) => {
            return rawresponse.json();
        }).then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                resolve(data);
            }
        });
    });
}

function getUserInfo(id) {
    const data = makeRequest('/user/' + id, 'GET')
    return data
}

// code below is from 
// https://medium.com/front-end-weekly/how-to-convert-24-hours-format-to-12-hours-in-javascript-ca19dfd7419d
// converts the date into a more readble format
function twelveHr(time) {
    var hours = time.getHours() ; // gives the value in 24 hours format
    var AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    var minutes = time.getMinutes();
    let day = time.getDate()
    let month = time.getMonth()
    let year = time.getFullYear()
    var finalTime = day + '/' + (month + 1) + '/' + year + ' ' + hours + ":" + minutes + " " + AmOrPm;
    return finalTime
}

/**
 * LOGIN AND REGISTER
 */

document.getElementById('submit-register').addEventListener('click', () => {
    const name = document.getElementById('name').value
    const email = document.getElementById('email-register').value
    const password1 = document.getElementById('password-register-1').value
    const password2 = document.getElementById('password-register-2').value
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (emailRegex.test(email)) {
        if (password1 === password2) {
            const data = makeRequest('/auth/register', 'POST', {
                email: email,
                password: password1,
                name: name
            }).then((data) => {
                token = data.token;
                userID = data.userId;
                login()
            })
        } else {
            alert("Passwords do not match")
        }
    } else {
        alert("PLease enter a valid email")
    }
    
})

document.getElementById('submit-login').addEventListener('click', () => {
    const email = document.getElementById('email-login').value
    const password = document.getElementById('password-login').value
    const data = makeRequest('/auth/login', 'POST', {
        email: email,
        password: password
    }).then((data) => {
        token = data.token;
        userID = data.userId;
        login()
    })
})

document.getElementById('register-link').addEventListener('click', () => {
    document.getElementById('login-page').style.display = 'none'
    document.getElementById('register-page').style.display = 'block'
    document.getElementById('name').value = ''
    document.getElementById('email-register').value = ''
    document.getElementById('password-register-1').value = ''
    document.getElementById('password-register-2').value = ''
})

document.getElementById('login-link').addEventListener('click', () => {
    document.getElementById('register-page').style.display = 'none'
    document.getElementById('login-page').style.display = 'block'
    document.getElementById('email-login').value = ''
    document.getElementById('password-login').value = ''
})

document.getElementById('logout-button').addEventListener('click', () => {
    const data = makeRequest('/auth/logout', 'POST').then((data) =>{
        logout();
    })
})

const login = () => {
    document.getElementById('profile').remove()
    const profile = document.createElement('img')
    profile.className = 'default-image user-profile'
    profile.setAttribute('id', 'profile')
    profile.src = 'defaultDP.jpg'
    
    getUserInfo(userID).then((user) => {
        if (user.image === null) {
            document.getElementById('top-bar').appendChild(profile)
        } else {
            document.getElementById('top-bar').appendChild(fileToDataUrl(user.image))
        }
        document.getElementById('profile').addEventListener('click', () => {
            userProfile(userID)
            document.getElementById('profile-display').style.display = 'block'
            document.getElementById('channel-details').style.display = 'none'
        })
    })
    document.getElementById('logged-out').style.display = 'none'
    document.getElementById('channel-details').style.display = 'none'
    document.getElementById('home-page').style.display = 'block'
    const welcome = document.createElement('span');
    welcome.setAttribute('id', 'welcome-name')
    getUserInfo(userID).then((info) => welcome.innerText = info.name)
    document.getElementById('hello-banner').appendChild(welcome);
    displayChannels()
} 

const logout = () => {
    document.getElementById('logged-out').style.display = 'flex'
    document.getElementById('home-page').style.display = 'none'
    document.getElementById('edit-profile-display').style.display = 'none'
    document.getElementById('profile-display').style.display = 'none'
    document.getElementById('email-login').value = ''
    document.getElementById('password-login').value = ''
    document.getElementById('welcome-name').remove()
    document.getElementById('welcome-channel').remove()
    token = null;
    userID = null;
} 

/**
 * PROFILE
 */

 const userProfile = (id) => {
    document.getElementById('profile-display').remove()
    const profilePage = document.createElement('div')
    profilePage.setAttribute('id', 'profile-display')
    profilePage.className = 'shadow mb-5 bg-white rounded profile-page'
    const closeButton = document.createElement('button')
    closeButton.setAttribute('id', 'close-profile')
    closeButton.setAttribute('aria-label', 'Close')
    closeButton.setAttribute('type', 'button')
    closeButton.className = 'btn-close'
    closeButton.addEventListener('click', () => { 
        document.getElementById('profile-display').style.display = 'none'
        document.getElementById('channel-details').style.display = 'block'
    })
    document.getElementById('main-bar').appendChild(profilePage)
    document.getElementById('profile-display').appendChild(closeButton)
    // if the user clicks on their profile allow them to edit
    if (id === userID) {
        const editButton = document.createElement('button')
        editButton.setAttribute('id', 'edit-profile')
        editButton.setAttribute('type', 'button')
        editButton.setAttribute('title', 'edit profile')
        editButton.className = 'edit-profile-button'
        editButton.innerText = String.fromCodePoint(0x270D)
        document.getElementById('profile-display').appendChild(editButton)
        editButton.addEventListener('click', () => { 
            document.getElementById('profile-display').style.display = 'none'
            document.getElementById('edit-profile-display').style.display = 'block'
            getUserInfo(id).then((user) => {
                document.getElementById('change-user-name').value = user.name
                document.getElementById('change-user-email').value = user.email
                document.getElementById('change-user-bio').value = user.bio
            })
        })
    }
    const image = document.createElement('img')
    const name = document.createElement('div')
    const email = document.createElement('div')
    const bio = document.createElement('div')
    image.className = 'default-image'
    image.src = 'defaultDP.jpg'
    getUserInfo(id).then((user) => {
        if (user.image === null) {
            document.getElementById('profile-display').appendChild(image)
        } else {
            document.getElementById('profile-display').appendChild(fileToDataUrl(user.image))
        }
        name.innerText = user.name
        email.innerText = user.email
        bio.innerText = user.bio
        document.getElementById('profile-display').appendChild(document.createElement('br'))
        document.getElementById('profile-display').appendChild(name)
        document.getElementById('profile-display').appendChild(email)
        document.getElementById('profile-display').appendChild(document.createElement('br'))
        document.getElementById('profile-display').appendChild(bio)
    })
}

document.getElementById('cancel-edit-profile').addEventListener('click', () => {
    document.getElementById('edit-profile-display').style.display = 'none'
})

document.getElementById('submit-edit-profile').addEventListener('click', () => {
    const password1 = document.getElementById('change-user-password').value
    const password2 = document.getElementById('confirm-user-password').value
    let pic = document.getElementById('change-profile-pic').value
    if (pic === '') {
        pic = null
    } else {
        // not sure if this works
        // dont know how to test
        pic = fileToDataUrl(document.getElementById('change-profile-pic').value)
    }
    if (password1 === '') {
        alert('You must enter a password')
    } else if (password1 !== password2) {
        alert('Passwords do not match')
    } else {
        const data = makeRequest('/user', 'PUT', {
            name: document.getElementById('change-user-name').value,
            email: document.getElementById('change-user-email').value,
            bio: document.getElementById('change-user-bio').value,
            password: password1,
            image: pic
        }).then((data) => {
            document.getElementById('edit-profile-display').style.display = 'none'
        })
    }
})

document.getElementById('show-password').addEventListener('click', () => {
    let x = document.getElementById("change-user-password");
    let y = document.getElementById("confirm-user-password");
    if (x.type === "password") {
      x.type = "text";
      y.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
    }
})

/**
 *  Multi-user interactivity
 */

document.getElementById('cancel-invite-user').addEventListener('click', () => {
    document.getElementById('invite-users-display').style.display = 'none'
})

document.getElementById('submit-invite-user').addEventListener('click', () => {
    if (selectedUsers.length === 0) {
        alert('Please select a user')
    } else {
        for (const user of selectedUsers) {
            const data = makeRequest('/channel/' + currentChannelID + '/' + 'invite', 'POST', {
                userId: parseInt(user) 
            }).then((data) => {
            })
        }
        document.getElementById('invite-users-display').style.display = 'none'
        viewChannel(currentChannelID)
    }
})

// html, css and js code used from here to create a modal
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
var modal = document.getElementById("invite-users-display");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function inviteUsers(channelID) {
    // refresh invite user list
    document.getElementById('invite-user-list').remove()
    const inviteList = document.createElement('div')
    inviteList.setAttribute('id', 'invite-user-list')
    document.getElementById('invite-users-modal').appendChild(inviteList)
    inviteList.innerText = 'Invite: '
    document.getElementById('not-members').remove()
    const notMembers = document.createElement('div')
    notMembers.setAttribute('id', 'not-members')
    document.getElementById('invite-users-modal').appendChild(notMembers)

    let usersNotInChannel = {}
    selectedUsers = []
    let numUsers = 0
    const data = makeRequest('/channel/' + channelID, 'GET').then((data) => {
        const data2 = makeRequest('/user', 'GET').then((data2) => {
            // get users that are not in chanel
            for (const user of data2.users) {
                if (!data.members.includes(user.id)) {
                    numUsers += 1
                    getUserInfo(user.id).then((info) => {
                        usersNotInChannel[info.name] = user.id
                        // once all users have been checked
                        if (Object.keys(usersNotInChannel).length === numUsers) {
                            // code used to sort the keys
                            // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
                            const ordered = Object.keys(usersNotInChannel).sort().reduce(
                                (obj, key) => { 
                                  obj[key] = usersNotInChannel[key]; 
                                  return obj;
                                }, 
                                {}
                              );
                            for (const username in ordered) {
                                const user = document.createElement('div')
                                user.innerText = username
                                user.setAttribute('id', usersNotInChannel[username])
                                user.className = 'invite-user'
                                user.addEventListener('click', () => { 
                                    // check if they have been selected
                                    if (!selectedUsers.includes(user.id)) {
                                        selectedUsers.push(user.id)
                                        const name = document.createElement('span')
                                        name.innerText = username + ', '
                                        document.getElementById('invite-user-list').appendChild(name)
                                    }
                                })
                                document.getElementById('not-members').appendChild(user)
                            }                     
                        }
                    })
                }
            }
        })
    })
}

/**
 * CHANNELS
 */

document.getElementById("hide-channels").addEventListener('click', () => {
    document.getElementById("sidebar").style.width = "0px";
    document.getElementById("open-channels").style.display = 'block'
    document.getElementById("sidebar").style.visibility = 'hidden'
    document.getElementById("channel-messages-body").style.width = '317px'
})

document.getElementById("open-channels").addEventListener('click', () => {
    document.getElementById("sidebar").style.width = "100px";
    document.getElementById("open-channels").style.display = 'none'
    document.getElementById("sidebar").style.visibility = 'visible'
    document.getElementById("channel-messages-body").style.width = '218px'

})

// display list of channels the user is in
// public channels will also be displayed even if the user is not in it
// if a user wants to join a public channel, they click on it and they will automatically join
const displayChannels = () => {
    const data = makeRequest('/channel', 'GET').then((data) => {
        document.getElementById('channel-list').remove()
        const channelList = document.createElement('div')
        channelList.setAttribute('id', 'channel-list')
        document.getElementById('sidebar').appendChild(channelList)
        for (const channel of data.channels) {
            const link = document.createElement('div');
            link.classList.add("channel")
            // click to join public channel
            link.addEventListener('click', () => {
                document.getElementById('delete-msg-display').style.display = 'none'
                document.getElementById('edit-msg-display').style.display = 'none'
                document.getElementById('react-msg-display').style.display = 'none'
                document.getElementById('pin-msg-display').style.display = 'none'
                document.getElementById('reactions-display').style.display = 'none'
                document.getElementById('profile-display').style.display = 'none'
                if (document.getElementById('welcome-channel') !== null) {
                    document.getElementById('welcome-channel').remove()
                }
                currentChannelID = channel.id
                currentChannelName = channel.name
                const welcome = document.createElement('span');
                welcome.setAttribute('id', 'welcome-channel')
                welcome.innerText = currentChannelName
                document.getElementById('welcome-banner').appendChild(welcome);
                if (channel.members.includes(userID)) {
                    viewChannel(currentChannelID)
                } else {
                    alert('You have joined ' + channel.name)
                    joinChannel(currentChannelID)
                }
            })
            if (channel.private) {
                link.innerText = String.fromCodePoint(0x1F512) + ' ' + channel.name;
                if (channel.members.includes(userID)) {
                    document.getElementById('channel-list').appendChild(link);
                    document.getElementById('channel-list').appendChild(document.createElement('br'))
                }
            } else {
                link.innerText = String.fromCodePoint(0x1F30D) + ' ' + channel.name;
                document.getElementById('channel-list').appendChild(link);
                document.getElementById('channel-list').appendChild(document.createElement('br'))
            }
            
        }
    })
}

const createChannel = () => {
    const name = document.getElementById('new-channel-name').value
    const description = document.getElementById('new-channel-description').value
    let channelExists = false
    let privacy = document.getElementById('new-channel-private').value
    if (privacy === "on") {
        privacy = true
    } else {
        privacy = false
    }
    const data = makeRequest('/channel', 'GET').then((data) => {
        for (const channel of data.channels) {
            // cant have different channels with the same name
            // my assumption
            if (channel.name === name) {
                channelExists = true
                alert('This channel name already exists')
                break;
            }
        }
        if (!channelExists) {
            if (name === "") {
                alert('Please enter a channel name')
            } else {
                const data = makeRequest('/channel', 'POST', {
                    name: name,
                    private: privacy,
                    description: description
                }).then((data) => {
                    displayChannels()
                })
            }
        }
    })
    
}

// view the contents of the channel
const viewChannel = (id) => {
    document.getElementById('info-icon').style.display = 'block'
    document.getElementById('user-list').remove()
    const userList = document.createElement('div')
    userList.setAttribute('id', 'user-list')
    userList.className = 'list'
    const header = document.createElement('h3')
    header.innerText = 'Users:'
    userList.appendChild(header)

    document.getElementById('home-page').appendChild(userList)
    document.getElementById('user-list').appendChild(document.createElement('br'))
    document.getElementById('user-list').style.display = 'block'

    const data = makeRequest('/user', 'GET').then((data) => {
        for (const user of data.users) {
            const username = document.createElement('span')
            const profile = document.createElement('img')
            profile.className = 'default-image'
            profile.src = 'defaultDP.jpg'
            // create a list that shows the users in the channel
            const data2 = makeRequest('/channel/' + currentChannelID, 'GET').then((data2) => {
                if (data2.members.includes(user.id)) {
                    username.className ='user-in-channel'
                    getUserInfo(user.id).then((info) => {
                        username.innerText = info.name
                        if (info.image === null) {
                            document.getElementById('user-list').appendChild(profile)
                        } else {
                            document.getElementById('user-list').appendChild(fileToDataUrl(info.image))
                        }
                        document.getElementById('user-list').appendChild(username)
                        document.getElementById('user-list').appendChild(document.createElement('br'))
                    })
                }
            })
        }
    })
    document.getElementById('channel-details').style.display = 'block'
    document.getElementById('new-channel-form').style.display = 'none'
    // invite users
    const inviteUserButton = document.createElement('div')
    inviteUserButton.setAttribute('id', 'invite-users')
    inviteUserButton.className = 'btn btn-dark mb-4'
    inviteUserButton.addEventListener('click', () => {
        inviteUsers(currentChannelID)
        document.getElementById('invite-users-display').style.display = 'block'
    })
    inviteUserButton.innerText = 'Invite users'
    document.getElementById('user-list').appendChild(inviteUserButton)
    document.getElementById('user-list').appendChild(document.createElement('br'))

    displayMessages(id)
    closeChannelDetails()
}

document.getElementById('create-channel').addEventListener('click', () => {
    document.getElementById('new-channel-description').value = ''
    document.getElementById('new-channel-name').value = ''
    document.getElementById('new-channel-private').value = 'off'
    document.getElementById('channel-details').style.display = 'none'
    document.getElementById('new-channel-form').style.display = 'block'
})

document.getElementById('submit-create-channel').addEventListener('click', () => {
    createChannel()
    document.getElementById('new-channel-form').style.display = 'none'
    document.getElementById('home-page').style.display = 'block'
})

// display channel name, creator, created at and descrption
const displayChannelDetails = (id) => {
    const data = makeRequest('/channel/' + id, 'GET').then((data) => {
        const channelName = data.name
        const description = data.description
        const privacy = data.private
        const timestamp = data.createdAt
        const creator = data.creator
        const detail = document.createElement('span');
        const detail2 = document.createElement('span');
        const finalTime = document.createElement('span');

        detail.innerText = channelName
        document.getElementById('edit-channel-name').appendChild(detail);
        getUserInfo(creator).then((user) => detail2.innerText = user.name)
        document.getElementById('channel-creator').appendChild(detail2);
        let timeCreated = new Date(timestamp)
        
        finalTime.innerText = twelveHr(timeCreated) 

        document.getElementById('channel-created').appendChild(finalTime);
        document.getElementById('edit-channel-description').innerText = description;

    })
}

document.getElementById('info-icon').addEventListener('click', () => {
    document.getElementById('details').style.display = 'block'
    document.getElementById('channel-messages-body').style.display = 'none'
    document.getElementById('channel-messages-top').style.display = 'none'
    document.getElementById('reactions-display').style.display = 'none'
    document.getElementById('pinned').style.display = 'none'
    displayChannelDetails(currentChannelID)
})

document.getElementById('edit-channel').addEventListener('click', () => {
    const data = makeRequest('/channel/' + currentChannelID, 'GET').then((data) => {
        const creator = data.creator
        if (userID !== creator) {
            alert("You are not the owner of this channel")
        } else {
            closeChannelDetails()
            document.getElementById('edit-channel-details').style.display = 'block'
        }
    })
})

document.getElementById('submit-edit-channel').addEventListener('click', () => {
    document.getElementById('edit-channel-details').style.display = 'none'
    document.getElementById('details').style.display = 'block'
    editChannel(currentChannelID)
    document.getElementById('change-channel-description').value = 'none'
})

document.getElementById('cancel-edit-channel').addEventListener('click', () => {
    document.getElementById('edit-channel-details').style.display = 'none'
    viewChannel(currentChannelID)
})

document.getElementById('leave-channel').addEventListener('click', () => {
    leaveChannel(currentChannelID)
    document.getElementById('edit-channel-details').style.display = 'none'
})

document.getElementById('close-channel-details').addEventListener('click', () => {
    closeChannelDetails()
    if (currentChannelID !== null) {
        viewChannel(currentChannelID)
    }
})

// close and refresh channel details
const closeChannelDetails = () => {
    const channel = document.getElementById('edit-channel-name')
    channel.removeChild(channel.firstElementChild)

    const time = document.getElementById('channel-created')
    time.removeChild(time.firstElementChild)

    const creator = document.getElementById('channel-creator')
    creator.removeChild(creator.firstElementChild)

    document.getElementById('details').style.display = 'none'
}

const joinChannel = (id) => {
    const data = makeRequest('/channel/' + id + '/join', 'POST').then((data) => {
        displayChannels()
        viewChannel(id)
    })
}

const leaveChannel = (id) => {
    let channel = null
    const channelDetails = makeRequest('/channel/' + currentChannelID, 'GET').then((channelDetails) => {
        channel = channelDetails.name
        const data = makeRequest('/channel/' + id + '/leave', 'POST').then((data) => {
            alert('You have left ' + channel)
            document.getElementById('details').style.display = 'none'
            document.getElementById('info-icon').style.display = 'none'
            displayChannels()
        }).catch(e => {
            console.log(e);
        });
    })
}

const editChannel = (id) => {
    const newName = document.getElementById('change-channel-name').value
    const newDescription = document.getElementById('change-channel-description').value
    const data = makeRequest('/channel/' + id, 'PUT', {
        name: newName,
        description: newDescription,
    }).then((data) => {
        document.getElementById('change-channel-description').value = ''
        document.getElementById('details').style.display = 'none'
        displayChannels()
        viewChannel(currentChannelID)
    })
}

/**
 * CHANNEL MESSAGES
 */

const displayMessages = (id) => {
    let username = null
    let timeSent = null
    let profilePic = null
    document.getElementById('channel-messages-body').remove()
    const channelMessages = document.createElement('div')
    channelMessages.setAttribute('id', 'channel-messages-body')
    document.getElementById('channel-details').appendChild(channelMessages)
    document.getElementById('pinned').remove()
    const pinned = document.createElement('div')
    pinned.setAttribute('id', 'pinned')
    pinned.className = 'shadow p-3 mb-5 bg-white rounded pinned-messages'
    pinned.innerText = String.fromCodePoint(0x1F4CC) + ' Pinned'
    document.getElementById('channel-details').appendChild(pinned)
    const data = makeRequest('/message/' + id + '?start=0', 'GET').then((data) => {
        for (const messageObj of data.messages) {
            const profile = document.createElement('img')
            profile.className = 'default-image'
            profile.src = 'defaultDP.jpg'

            timeSent = new Date(messageObj.sentAt)
           
            const messageDiv = document.createElement('div')
            const msgDetail = document.createElement('span')
            msgDetail.className = 'click-profile'
            // if user clicks on another user's name
            getUserInfo(messageObj.sender).then((user) => msgDetail.innerText = ' ' + user.name + ', ' + twelveHr(timeSent))
            msgDetail.addEventListener('click', () => {
                userProfile(messageObj.sender)
                document.getElementById('profile-display').style.display = 'block'
                document.getElementById('channel-details').style.display = 'none'
            })
            messageDiv.innerText = messageObj.message
            const button = messageOptions(messageObj.sender)
            button.addEventListener('click', () => {
                document.getElementById('reactions-display').style.display = 'none'
                currentMsgID = messageObj.id
                currentMsg = messageObj.message
            })
            getUserInfo(messageObj.sender).then((user) => {
                document.getElementById('channel-messages-body').appendChild(button)
                const reactionsButton  = reactionList(messageObj.id)
                // check if message has reacts
                if (messageObj.reacts.length) {
                    document.getElementById('channel-messages-body').appendChild(reactionsButton)
                }
                // check if the message has been edited
                const edited = document.createElement('div')
                if (messageObj.edited) {
                    const italics = document.createElement('i')
                    const editTime = new Date(messageObj.editedAt)
                    italics.innerText = 'edited, ' + twelveHr(editTime)
                    italics.className = 'msgDetail'
                    edited.appendChild(italics)
                    document.getElementById('channel-messages-body').appendChild(edited)
                }
                document.getElementById('channel-messages-body').appendChild(messageDiv)
                document.getElementById('channel-messages-body').appendChild(msgDetail)

                if (user.image === null) {
                    document.getElementById('channel-messages-body').appendChild(profile)
                } else {
                    document.getElementById('channel-messages-body').appendChild(fileToDataUrl(user.image))
                }
                // check if the message is pinned
                if (messageObj.pinned) {
                    addPinnedMessage(messageObj.id)
                }
                document.getElementById('channel-messages-body').appendChild(document.createElement('hr'))
            })
        }
    })
    document.getElementById('channel-messages-body').style.display = 'flex'
    document.getElementById('channel-messages-top').style.display = 'block'
}


document.getElementById('submit-msg').addEventListener('click', () => {
    const msg = document.getElementById('message-area').value
    if (msg === '' || msg === ' ') {
        alert('You cannot send an empty message')
    } else {
        const data = makeRequest('/message/' + currentChannelID, 'POST', {
            message: msg
        }
        ).then((data) => {
            document.getElementById('message-area').value = ''
            displayMessages(currentChannelID)
        })
    }
})

/**
 * Message options (Delete, Edit, React, Pin)
 */

function messageOptions(senderID) {
    const dropdown = document.createElement('span')
    dropdown.classList.add('dropdown')

    const button = document.createElement('button')
    button.className = 'btn btn-secondary dropdown-toggle'
    button.setAttribute('type', 'button')
    button.setAttribute('id', 'message-options')
    button.setAttribute('data-toggle', 'dropdown')
    button.setAttribute('aria-haspopup', 'true')
    button.setAttribute('aria-expanded', 'false')
    button.innerText = ' . . . '

    const dropdownMenu = document.createElement('button')
    dropdownMenu.setAttribute('aria-labelledby', 'message-options')
    dropdownMenu.className = 'dropdown-menu'
    
    // delete message
    const deleteMsg = document.createElement('button')
    deleteMsg.innerText = 'Delete'
    deleteMsg.setAttribute('id', 'delete-msg')
    deleteMsg.className ='dropdown-item'
    deleteMsg.addEventListener('click', () => {
        document.getElementById('delete-msg-display').style.display = 'block'
        document.getElementById('react-msg-display').style.display = 'none'
        document.getElementById('edit-msg-display').style.display = 'none'
        document.getElementById('pin-msg-display').style.display = 'none'
    })

    // edit message
    const editMsg = document.createElement('button')
    editMsg.innerText = 'Edit'
    editMsg.setAttribute('id', 'edit-msg')
    editMsg.className ='dropdown-item'
    editMsg.addEventListener('click', () => {
        if (senderID === userID) {
            document.getElementById('edit-msg-display').style.display = 'block'
            document.getElementById('react-msg-display').style.display = 'none'
            document.getElementById('pin-msg-display').style.display = 'none'
            document.getElementById('delete-msg-display').style.display = 'none'
            document.getElementById('edit-message-area').value = currentMsg
        } else {
            alert("You do not own this message")
        }
    })

    // react to message
    const reactMsg = document.createElement('button')
    reactMsg.innerText = 'React'
    reactMsg.setAttribute('id', 'react-msg')
    reactMsg.className ='dropdown-item'
    reactMsg.addEventListener('click', () => {
        document.getElementById('react-msg-display').style.display = 'block'
        document.getElementById('pin-msg-display').style.display = 'none'
        document.getElementById('edit-msg-display').style.display = 'none'
        document.getElementById('delete-msg-display').style.display = 'none'
    })

    // pin message
    const pinMsg = document.createElement('button')
    pinMsg.innerText = 'Pin'
    pinMsg.setAttribute('id', 'pin-msg')
    pinMsg.className ='dropdown-item'
    pinMsg.addEventListener('click', () => {
        document.getElementById('pin-msg-display').style.display = 'block'
        document.getElementById('react-msg-display').style.display = 'none'
        document.getElementById('edit-msg-display').style.display = 'none'
        document.getElementById('delete-msg-display').style.display = 'none'
    })
    
    dropdownMenu.appendChild(deleteMsg)
    dropdownMenu.appendChild(editMsg)
    dropdownMenu.appendChild(reactMsg)
    dropdownMenu.appendChild(pinMsg)
    dropdown.appendChild(button)
    dropdown.appendChild(dropdownMenu)
    return dropdown
}


document.getElementById('cancel-delete-msg').addEventListener('click', () => {
    document.getElementById('delete-msg-display').style.display = 'none'
})

document.getElementById('submit-delete-msg').addEventListener('click', () => {
    const data = makeRequest('/message/' + currentChannelID + '?start=0', 'GET').then((data) => {
        for (const messageObj of data.messages) {
            if (messageObj.id === currentMsgID) {
                if (userID !== messageObj.sender) {
                    alert('You do not own this message')
                    document.getElementById('delete-msg-display').style.display = 'none'
                } else {
                    const data = makeRequest('/message/' + currentChannelID + '/' + currentMsgID, 'DELETE').then((data) => {
                        alert('Message has been deleted')
                        displayMessages(currentChannelID)
                        document.getElementById('delete-msg-display').style.display = 'none'
                    })
                }
            }
        }
    })
})

document.getElementById('cancel-edit-msg').addEventListener('click', () => {
    document.getElementById('edit-msg-display').style.display = 'none'
})

document.getElementById('submit-edit-msg').addEventListener('click', () => {
    const newMsg = document.getElementById('edit-message-area').value
    if (currentMsg === newMsg) {
        alert('The message has to be edited')
    } else {
        const data = makeRequest('/message/' + currentChannelID + '?start=0', 'GET').then((data) => {
            for (const messageObj of data.messages) {
                if (messageObj.id === currentMsgID) {
                    if (userID !== messageObj.sender) {
                        alert('You do not own this message')
                        document.getElementById('edit-msg-display').style.display = 'none'
                    } else {
                        const data = makeRequest('/message/' + currentChannelID + '/' + currentMsgID, 'PUT',{
                            message: newMsg
                        }).then((data) => {
                            alert('Message has been edited')
                            displayMessages(currentChannelID)
                            document.getElementById('edit-msg-display').style.display = 'none'
                        })
                    }
                }
            }
        })
    }
})

function reactionList(id) {
    currentMsgID = id
    const list = document.createElement('span')
    const button = document.createElement('button')
    button.className = 'btn btn-info'
    button.innerText = 'Reactions'
    button.setAttribute('id', 'reaction-button')
    button.addEventListener('click', () => {
        // add reactions to reactionsdisplay
        document.getElementById('reactions').remove()
        const reactionsDisplay = document.createElement('div')
        reactionsDisplay.setAttribute('id', 'reactions')
        document.getElementById('reactions-display').appendChild(reactionsDisplay)
        const data = makeRequest('/message/' + currentChannelID + '?start=0', 'GET').then((data) => {
            for (const messageObj of data.messages) {
                if (messageObj.id === id) {
                    for (const reactObj of messageObj.reacts) {
                        const emoji = document.createElement('div')
                        switch (reactObj.react) {
                            case 'thumbs-up':
                                getUserInfo(reactObj.user).then((user) => emoji.innerText = String.fromCodePoint(0x1F44D) + ' - ' + user.name)
                                break
                            case 'love-heart':
                                getUserInfo(reactObj.user).then((user) => emoji.innerText = String.fromCodePoint(0x1F496) + ' - ' + user.name)
                                break
                            case 'laugh':
                                getUserInfo(reactObj.user).then((user) => emoji.innerText = String.fromCodePoint(0x1F602) + ' - ' + user.name)
                                break
                        }
                        // users can only unreact their reacts
                        if (reactObj.user === userID) {
                            emoji.addEventListener('click', () => {
                                const data = makeRequest('/message/unreact/' + currentChannelID + '/' + id, 'POST', {
                                    react: reactObj.react
                                }).then((data) => {
                                    if (messageObj.reacts.length === 1) {
                                        document.getElementById('reaction-button').remove()
                                    }
                                    document.getElementById('reactions-display').style.display = 'none'
                                })
                            })
                            const removeEmoji = document.createElement('div')
                            removeEmoji.innerText = 'click to remove'
                            removeEmoji.className = 'remove-emoji-text'
                            emoji.className = 'remove-emoji'
                            document.getElementById('reactions').appendChild(emoji)
                            document.getElementById('reactions').appendChild(removeEmoji)
                        } else {
                            document.getElementById('reactions').appendChild(emoji)
                        }
                        document.getElementById('reactions').appendChild(document.createElement('br'))
                    }
                    break;
                }
            }
        })
        document.getElementById('reactions-display').style.display = 'block'
    })
    list.appendChild(button)
    return list 
}

document.getElementById('close-react').addEventListener('click', () => {
    document.getElementById('react-msg-display').style.display = 'none'
})

document.getElementById('thumbs-up-react').addEventListener('click', () => {
    const data = makeRequest('/message/react/' + currentChannelID + '/' + currentMsgID, 'POST',{
        react: 'thumbs-up'
    }).then((data) => {
        displayMessages(currentChannelID)
        document.getElementById('react-msg-display').style.display = 'none'
    })
})

document.getElementById('love-heart-react').addEventListener('click', () => {
    const data = makeRequest('/message/react/' + currentChannelID + '/' + currentMsgID, 'POST',{
        react: 'love-heart'
    }).then((data) => {
        displayMessages(currentChannelID)
        document.getElementById('react-msg-display').style.display = 'none'
    })
})

document.getElementById('laugh-react').addEventListener('click', () => {
    const data = makeRequest('/message/react/' + currentChannelID + '/' + currentMsgID, 'POST',{
        react: 'laugh'
    }).then((data) => {
        displayMessages(currentChannelID)
        document.getElementById('react-msg-display').style.display = 'none'
    })
})

document.getElementById('close-reactions').addEventListener('click', () => {
    document.getElementById('reactions-display').style.display = 'none'
})

document.getElementById('cancel-pin-msg').addEventListener('click', () => {
    document.getElementById('pin-msg-display').style.display = 'none'
}) 

document.getElementById('submit-pin-msg').addEventListener('click', () => {
    const data = makeRequest('/message/pin/' + currentChannelID + '/' + currentMsgID, 'POST').then((data) => {
        addPinnedMessage(currentMsgID)
        displayMessages(currentChannelID)
        document.getElementById('pin-msg-display').style.display = 'none'
    })
    document.getElementById('pin-msg-display').style.display = 'none'
}) 

const addPinnedMessage = (id) => {
    let timeSent = null
    document.getElementById('pinned').remove()
    const pinned = document.createElement('div')
    pinned.setAttribute('id', 'pinned')
    pinned.className = 'shadow p-3 mb-5 bg-white rounded pinned-messages'
    pinned.innerText = String.fromCodePoint(0x1F4CC)
    document.getElementById('channel-details').appendChild(pinned)
    const data = makeRequest('/message/' + currentChannelID + '?start=0', 'GET').then((data) => {
        for (const messageObj of data.messages) {
            if (messageObj.id === id) {
                const profile = document.createElement('img')
                profile.className = 'default-image'
                profile.src = 'defaultDP.jpg'
    
                timeSent = new Date(messageObj.sentAt)
                 
                const messageDiv = document.createElement('div')
                const msgDetail = document.createElement('span')
                getUserInfo(messageObj.sender).then((user) => msgDetail.innerText = ' ' + user.name + ', ' + twelveHr(timeSent))
                messageDiv.innerText = messageObj.message
                const unpin = document.createElement('div')
                unpin.innerText = 'click to unpin'
                unpin.className = 'unpin'
                unpin.addEventListener('click', () => {
                    const data1 = makeRequest('/message/unpin/' + currentChannelID + '/' + id, 'POST').then((data1) => {
                        displayMessages(currentChannelID)
                        if (document.getElementById('pinned').childElementCount === 0) {
                            document.getElementById('pinned').style.display = 'none'
                        }
                    })
                })
                const button = messageOptions()
                button.addEventListener('click', () => {
                    document.getElementById('reactions-display').style.display = 'none'
                    currentMsgID = messageObj.id
                    currentMsg = messageObj.message
                })
                getUserInfo(messageObj.sender).then((user) => {
                    document.getElementById('pinned').appendChild(unpin)

                    if (user.image === null) {
                        document.getElementById('pinned').appendChild(profile)
                    } else {
                        document.getElementById('pinned').appendChild(fileToDataUrl(user.image))
                    }
                    document.getElementById('pinned').appendChild(msgDetail)
                    document.getElementById('pinned').appendChild(messageDiv)
                    const edited = document.createElement('div')
                    if (messageObj.edited) {
                        const italics = document.createElement('i')
                        const editTime = new Date(messageObj.editedAt)
                        italics.innerText = 'edited, ' + twelveHr(editTime)
                        italics.className = 'msgDetail'
                        edited.appendChild(italics)
                        document.getElementById('pinned').appendChild(edited)
                    }
                    document.getElementById('pinned').appendChild(button)
                    const reactionsButton  = reactionList(messageObj.id)
                    if (messageObj.reacts.length) {
                        document.getElementById('pinned').appendChild(reactionsButton)
                    }
                    document.getElementById('pinned').appendChild(document.createElement('br'))
                    document.getElementById('pinned').appendChild(document.createElement('br'))
                })
                break;
            }
        }
    })
    document.getElementById('pinned').style.display = 'block'
}