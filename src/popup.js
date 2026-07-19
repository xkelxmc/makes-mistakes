const flash = document.getElementById("flash")

chrome.storage.sync.get({ flash: true }).then((settings) => {
  flash.checked = settings.flash
})

flash.addEventListener("change", () => {
  chrome.storage.sync.set({ flash: flash.checked })
})
