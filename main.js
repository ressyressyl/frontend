// imported modules
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require('axios');
const dotenv = require('dotenv').config();

// main window
const isDev = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

app.whenReady().then(() => {
  // intialize functions
  ipcMain.handle('axios.openAI', openAI);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


// main functions
async function openAI(event, create){
  let res = null;

  const env = dotenv.parsed;

  await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      model: "text-davinci-003",
      prompt: "Create a list of 8 questions for my interview with \n\n" + create,
      temperature: 0.5,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + env.APIKEY_OPENAI
    }
  }).then(function (response) {
    res = response.data;
  })
  .catch(function (error) {
    res = error;
  });

  return res;
}