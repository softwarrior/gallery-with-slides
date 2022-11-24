"use strict";

const findCSS = (cssURL) => {
  if (!cssURL) return null;
  try {
    const sel = `link[href$="${cssURL}"]`
    const css = document.querySelector(sel)
    if (css)
      return css;
  } 
  catch { 
    return null;
  }
  return null;
}

const createCSS = (cssURL) => {
  const link = document.createElement( 'link' );
  link.rel = 'stylesheet';
  link.href = cssURL;
  return link
}

const loadCSS = (cssURL) => {
  return new Promise((resolve, reject) => {
    let css = findCSS(cssURL)
    if (css) {
        css.disabled = false
        resolve()
        return
    }
    css = createCSS(cssURL)
    document.head.appendChild(css);
    css.onload = () => { 
        resolve(); 
    };
    css.onerror = () => { 
      reject(); 
    };
  });
}

const removeCSS = (cssURL) => {
  return new Promise((resolve, reject) => {
    const css = findCSS(cssURL)
    if (css) {
        css.disabled = true
        resolve()
        return
    }
    reject()
  })
}

var form = document.querySelector("form");
var log = document.querySelector("#log");

form.addEventListener("submit", (event) => {
  const data = new FormData(form);
  let output = "";
  for (const entry of data) {
    output = "css/" + entry[1] + "." + entry[0];
  }
  const css = log.innerText
  if (css) {
    removeCSS(css)
    .then(() => {
      loadCSS(output).then(() => {
        console.log('CSS had been loaded.');
      }).catch(() =>{ 
        console.log('CSS had not been loaded.');
      });
    }).catch(()=> {
      console.log('CSS had not been removed.');
    })
  } else {
    loadCSS(output).then(() => {
      console.log('CSS had been loaded.');
    }).catch(() =>{ 
      console.log('CSS had not been loaded.');
    });
  }
  log.innerText = output;
  event.preventDefault();
}, false);