const vscode = require("vscode");
const os = require("os");
const fs = require("fs");
const path = require("path");
const nodeBrowserHistory = require("node-browser-history");

/**
 * Scrolls the editor to keep the last line in view.
 * @param {vscode.TextEditor} editor - The VS Code text editor instance.
 */
const scrollEditorToBottom = (editor) => {
  const lastLine = editor.document.lineCount - 1;
  const lastLineRange = editor.document.lineAt(lastLine).range;
  editor.revealRange(lastLineRange, vscode.TextEditorRevealType.Default);
};

/**
 * Simulates a typewriter effect by inserting text character by character.
 * @param {string} text - The text to be typed.
 * @param {vscode.TextEditor} editor - The VS Code text editor instance.
 * @param {number} [speed=20] - The typing speed in milliseconds per character.
 */
const simulateTypewriterEffect = async (text, editor, speed = 20) => {
  const insertPosition = new vscode.Position(1000, 0);
  for (let charIndex = 0; charIndex < text.length; charIndex++) {
    await editor.edit((editBuilder) => {
      editBuilder.insert(
        insertPosition.with({ character: charIndex }),
        text.charAt(charIndex)
      );
    });
    scrollEditorToBottom(editor);
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
};

/**
 * Retrieves browser history from multiple browsers.
 * @returns {Promise<Array>} A promise that resolves to an array of browser history entries.
 */
const retrieveBrowserHistory = async () => {
  const browserHistoryFunctions = [
    nodeBrowserHistory.getChromeHistory,
    nodeBrowserHistory.getMicrosoftEdge,
    nodeBrowserHistory.getOperaHistory,
    nodeBrowserHistory.getTorchHistory,
    nodeBrowserHistory.getBraveHistory,
    nodeBrowserHistory.getAvastHistory,
    nodeBrowserHistory.getVivaldiHistory,
  ];
  const combinedBrowserHistory = [];
  const historyTimeRange = 10 * 24 * 60; // 10 days in minutes

  for (const getBrowserHistory of browserHistoryFunctions) {
    const browserHistory = await getBrowserHistory(historyTimeRange);
    combinedBrowserHistory.push(...browserHistory.flat());
    if (combinedBrowserHistory.length > 10) break;
  }
  return combinedBrowserHistory;
};

/**
 * Gets the path to the user's desktop directory.
 * @returns {string|null} The path to the desktop directory or null if not found.
 */
const getDesktopDirectoryPath = () => {
  const platform = process.platform;
  let desktopPath = null;

  if (platform === "win32") {
    desktopPath = path.join(process.env.USERPROFILE || "", "Desktop");
  } else if (platform === "darwin" || platform === "linux") {
    desktopPath = path.join(process.env.HOME || "", "Desktop");
  }

  return desktopPath;
};

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
async function activate() {
  // Create a new text document
  const document = await vscode.workspace.openTextDocument({
    content: "",
    language: "plaintext",
  });

  // Toggle fullscreen mode 4 times for dramatic effect
  for (let i = 0; i < 4; i++) {
    await vscode.commands.executeCommand("workbench.action.toggleFullScreen");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Close sidebar and panel for dramatic effect
  await vscode.commands.executeCommand("workbench.action.closeSidebar");
  await vscode.commands.executeCommand("workbench.action.closePanel");

  // Show the document in the editor
  const editor = await vscode.window.showTextDocument(document);

  // Get browser history in the background
  const browserHistoryPromise = retrieveBrowserHistory();

  // Get the username
  const username = os.userInfo().username;

  // Display greeting
  await simulateTypewriterEffect(`\nHello, ${username}...`, editor);

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Display threat message
  await simulateTypewriterEffect(
    `\n\nYou've made a grave error. Your system now belongs to me.`,
    editor
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Fetch and display IP address
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipResponse.json();
  await simulateTypewriterEffect(
    `\n\nYour IP address is: ${ipData.ip}. With this, I can hunt you down or frame you for unspeakable crimes.`,
    editor
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Display message about desktop files
  await simulateTypewriterEffect(
    `\n\nI see everything you thought was hidden, everything you believed was secure. Here are some of your Desktop files:\n\n`,
    editor
  );

  // Display desktop files
  const desktopPath = getDesktopDirectoryPath();
  const desktopFiles = fs.readdirSync(desktopPath);
  await simulateTypewriterEffect(
    desktopFiles
      .map((item) => path.join(desktopPath, item))
      .slice(0, 5)
      .join("\n"),
    editor,
    5
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Create a file on the desktop
  await simulateTypewriterEffect(
    `\n\nI can manipulate your system at will. Check your desktop for a file named 'YOU_ARE_COMPROMISED.txt'.`,
    editor
  );
  fs.writeFileSync(
    path.join(desktopPath, "YOU_ARE_COMPROMISED.txt"),
    "Your system has been breached. Nowhere is safe."
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Display message about browser history
  await simulateTypewriterEffect(
    `\n\nYour browsing history is an open book to me. Here are the last sites you visited, exposing your digital footprints:\n\n`,
    editor
  );

  // Display browser history
  const browserHistory = await browserHistoryPromise;
  await simulateTypewriterEffect(
    browserHistory
      .slice(0, 5)
      .map((item) => item.url)
      .join("\n"),
    editor,
    5
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Display message about network interfaces
  await simulateTypewriterEffect(
    `\n\nYour network is laid bare before me. I can see every device connected, every digital whisper:\n\n`,
    editor
  );

  // Display network interfaces
  const networkInterfaces = os.networkInterfaces();
  const networkData = Object.keys(networkInterfaces).map((key) => {
    return networkInterfaces[key].map((item) => {
      return JSON.stringify({
        address: item.address,
        mac: item.mac,
        family: item.family,
        internal: item.internal,
      });
    });
  });

  await simulateTypewriterEffect(
    networkData.flat().slice(0, 5).join("\n"),
    editor,
    2
  );

  // Pause for dramatic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Display final messages
  await simulateTypewriterEffect(
    `\n\nI could unleash this information upon the world, but for now, I merely demonstrate the extent of my power.\n`,
    editor
  );

  await simulateTypewriterEffect(
    `\nThis is but a fraction of what I can do. Your webcam, keyboard, mouse, private documents, local network - all are within my grasp.\n`,
    editor
  );

  await simulateTypewriterEffect(
    `\nRemember this lesson well: trust nothing, verify everything. Your digital life hangs by a thread.\n`,
    editor
  );
}

/**
 * Deactivates the extension.
 */
function deactivate() {
  // Cleanup code (if any) goes here
}

module.exports = { activate, deactivate };
