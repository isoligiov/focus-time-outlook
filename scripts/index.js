const PROJECT_NAME = 'BD';
const SENSITIVE_CHANNELS = [
];

let previousState = {};
let initialState = true;

(async () => {
  while(true) {
    try {
      const currentState = {}
      const markAsReadButtons = document.querySelectorAll("div[data-app-section='MessageList'] button[title='Mark as read']")
      for(let markAsReadButton of markAsReadButtons) {
        try {
          let parent = markAsReadButton.parentElement
          while(parent && parent.getAttribute('role') !== "option")
            parent = parent.parentElement
          if(!parent) break
          const labels = parent.querySelectorAll('span[title]')
          const header = labels[0].textContent.trim()
          const preview = labels[1].textContent.trim()
          const timestamp = labels[2].textContent.trim()
          currentState[header] = { timestamp, preview }
        } catch(err) {}
      }
      let text = ''
      for(let header in currentState) {
        const preview = currentState[header].preview
        if(preview !== previousState[header]?.preview) {
          const previewText = (preview || "").replace('`', '"').split(/[\r\n]/g).filter(line => line.length > 0).map(line => `\`${line}\``).join("\n")
          text += `*${header} @ ${PROJECT_NAME}* sent email!
${previewText}\n`
        }
      }
      if(text.length > 0) {
        await chrome.runtime.sendMessage({
          message_type: 'sendUpdate',
          text,
        })
      }
      previousState = currentState
    } catch(err) {
    }
    await sleep(1000)
  }
})()