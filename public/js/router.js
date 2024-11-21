// creating a simple router for my SPA
import { sketch } from './sketch.js'
import { getData, insertData } from './database.js';

// import p5 from 'p5'
// import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';
// import { Letterize } from "../node_modules/letterizejs/lib/letterize.js"
// import anime from '../node_modules/animejs/lib/anime.es.js';
// import anime from 'animejs';
// import Letterize from 'letterizejs';
import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';
// import { Letterize } from 'https://cdn.jsdelivr.net/npm/letterizejs@2.0.1/lib/letterize.min.js';



export function router ()   {
  console.log("router running: current path: " + window.location.pathname)
  let path = window.location.pathname;
  console.log("path: " + path)
  if (path === '/dll-confessions2/public/index.html') {
    console.log('show intro')
    showIntroduction();
  } else if (path ==='/app') {
    showApp();
  } else if (path ==='/confessions') {
    showConfessions();
  }
}

export function navigateTo(path) {
  console.log("navigating to: " + path);
  history.pushState({}, '', path);
  router();
}

function showIntroduction() {
  document.body.innerHTML=`
    <div id="intro">
      <div class="flex flex-col items-center justify-center h-screen">
      <div id="welcome-container" class="text-4xl text-center p-8"> 
          <h1  class="welcome-text absolute top-50 left-0 right-0 text-center">Welcome to your confession booth.</h1>
          <h1 class="welcome-text absolute top-50 left-0 right-0 text-center">What you write here is anonymous.</h1>
          <h1 class="welcome-text absolute top-50 left-0 right-0 text-center">Personal computing is a visual, tactile, and auditory experience. </h1>
          <h1 class="welcome-text absolute top-50 left-0 right-0 text-center">Our senses are always present, and always on guard.</h1>
          <h1 class="welcome-text absolute top-50 left-0 right-0 text-center">Can we make ourselves more vulnerable on the internet by reducing them?</h1>
          <h1 class="welcome-text absolute top-50 left-0 right-0 text-center">Let's begin...</h1>
      </div>
        <button id="btn-app" class="opacity-0 pt-16 button text-slate-300 hover:text-black text-center">Enter the booth</button>
      </div>
    </div>
    `
    const welcomeText = new Letterize({targets: document.querySelectorAll(".welcome-text"), className: 'letter'});
    console.log(document.querySelector("#welcome-container h1:nth-child(1) .letter"))
    anime.timeline({}).add({
      targets: "#welcome-container h1:nth-child(1) .letter",
      translateX: [30, 0],
      translateZ: 0,
      opacity: [0,1],
      easing: "easeOutExpo",
      duration: 1500,
      delay: (el, i)=>500 + 30 * i
    }).add({
      targets: "#welcome-container h1:nth-child(1) .letter",
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1000,
      delay: (el, i)=>100 + 20 * i
    }) .add({
      targets: "#welcome-container h1:nth-child(2) .letter",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: (el, i)=>500 + 30 * i
    }).add({
      targets: "#welcome-container h1:nth-child(2) .letter",
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1000,
      delay: (el, i)=>100 + 20 * i
    }).add({
      targets: "#welcome-container h1:nth-child(3) .letter",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: (el, i)=>500 + 30 * i
    }).add({
      targets: "#welcome-container h1:nth-child(3) .letter",
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1000,
      delay: (el, i)=>100 + 20 * i
    }).add({
      targets: "#welcome-container h1:nth-child(4) .letter",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: (el, i)=>100 + 30 * i
    }).add({
      targets: "#welcome-container h1:nth-child(4) .letter",
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1000,
      delay: (el, i)=>100 + 20 * i
    }).add({
      targets: "#welcome-container h1:nth-child(5) .letter",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: (el, i)=>100 + 30 * i
    }).add({
      targets: "#welcome-container h1:nth-child(5) .letter",
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1000,
      delay: (el, i)=>100 + 20 * i
    }).add({
      targets: "#welcome-container h1:nth-child(6) .letter, #btn-app",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: (el, i)=>100 + 30 * i
    })
    
    document.getElementById('btn-app').addEventListener("click", () => navigateTo('/app'))
}



function showApp() {
  document.body.innerHTML=`
    <div id="intro" class="h-full w-screen fixed inset-0 overflow-hidden flex flex-col items-center justify-center">
      <div class="mx-auto flex flex-col items-center">
        <h1 class="text-4xl text-center mb-8">Close your eyes and think of a secret...</h1>
        <form action="" id="messageForm" class="flex flex-col items-center m-8 w-full">
          <textarea 
            id="textInput" 
            class="block w-full p-4 mb-2 mt-8 border-2 border-black placeholder:text-slate-400 rounded-lg disabled:bg-gray-300 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-2000 active:outline-none"
            name="textInput" 
            rows="4" 
            placeholder="( you will be able to type when you hear the music... )"
            disabled
          ></textarea>
          <button type="submit" class="button text-slate-400 transition hover:text-black mx-4 my-2">submit confession</button>
        </form>
        <div id="canvas"></div>
        <div id="blackout" class="opacity-0 w-full h-full absolute top-0 left-0 transition-opacity duration-1000 bg-black opacity-0 pointer-events-none"></div>
        <div class="fixed bottom-0 left-0 right-0 flex justify-between p-4">
          <button id="btn-intro" class="text-slate-300 hover:text-black mx-4 my-2 transition">Back</button>
          <button id="btn-info" class="text-slate-300 hover:text-black mx-4 my-2 transition">Info</button>
        </div>
      </div>
    </div>
  `
  
  new p5(sketch, document.getElementById('canvas'))
    // Add form submission handler
    document.getElementById('messageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('submitting...')
      const message = document.getElementById("textInput").value;

      await insertData(message);
      document.getElementById("textInput").value = ''; // Clear the input
      // Optionally navigate to confessions page
      navigateTo('/confessions');
    });
  
  document.getElementById('btn-intro').addEventListener("click", () => {
    document.getElementById('canvas').innerHTML = '' //disposing of sketch
    navigateTo('/')
  })
}
function showConfessions() {
  document.body.innerHTML=`
    <div id="confessions" class="w-screen h-screen flex flex-col items-center justify-center">
      <h1 class="text-4xl text-center m-8">Confessions</h1>
      <div id="msgs" class="w-full h-full"></div>
      <button id="btn-app" class="fixed bottom-0 left-0 right-0 text-slate-400 hover:text-black mx-4 my-8 transition">have another confession to make?</button>
    </div>
  `
  // Load and display confessions
  loadConfessions();
  document.getElementById('btn-app').addEventListener("click", () => navigateTo('/app'))
}

async function loadConfessions() {
  const messages = await getData();
  console.log("messages " + JSON.stringify(messages))
  if (messages) {
    const msgsContainer = document.getElementById('msgs');
    messages.forEach(({confession}) => {
      const messageTemplate = `
        <div class="max-w-40" style="position:absolute;left:${Math.random()*screen.width}px;top:${Math.random()*screen.height}px">
          <div>${confession}</div>
        </div>
      `;
      msgsContainer.insertAdjacentHTML('beforeend', messageTemplate);
    });
  }
}
// Handle browser back/forward navigation
window.addEventListener('popstate', router);

// Initial routing
router();
