// here we make all our Components, Pages and Classes available to the Esbuild compiler.
// Components
import './components/sidebar/MenuEntry';
import './components/forms/Title';
import './components/forms/RichText'
import './components/general/Surface'
import './components/forms/Button'
import './components/general/Popup'
import './components/general/Notification'
import './components/forms/TextField'
import './components/advanced/Graph'

// Layouts
import './layouts/Split'

// Views
import './pages/Dashboard'
import './pages/views/Sidebar'
import './pages/views/full_frame/Home'
import './pages/views/full_frame/Account'
import './pages/views/full_frame/Devices'
import './pages/views/full_frame/Layout'
import './pages/views/full_frame/Predictions'
import './pages/views/full_frame/Sensors'
import './pages/views/full_frame/Auth'

const element = document.createElement('pg-dashboard')
document.body.appendChild(element)

/*
const pill_button = document.createElement('pill-button')
document.body.appendChild(pill_button)
pill_button.type = ButtonModule.Styles["Primary"]
pill_button.setAttribute('title', 'Continue');


const pill_button_2 = document.createElement('pill-button')
document.body.appendChild(pill_button_2)
pill_button_2.setAttribute('title', 'Cancel');

const menu_entry = document.createElement('menu-entry')
menu_entry.type = MenuEntry.Styles["Selected"]
document.body.appendChild(menu_entry)
menu_entry.setAttribute('title', 'Entry');

const menu_entry2 = document.createElement('menu-entry')
menu_entry2.type = MenuEntry.Styles["Unselected"]
document.body.appendChild(menu_entry2)
menu_entry2.setAttribute('title', 'Entry');

const title = document.createElement('md-title')
document.body.appendChild(title)
title.setAttribute('title', 'SmartHome');

const rich = document.createElement('md-richtext')
document.body.appendChild(rich)
rich.setAttribute('text', 'SmartHome, Lorem Ipsum\n Lorem Ipsummmm helvetixa lorem ipsum is een topzoi en lorem ipsum en lorem ipsum en ahaa is een toppertje en echt geweldig. Ja echt. Echt een toppertje. Lorem ipsum a la avadra kedabra.');
*/