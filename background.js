let tabRefreshState = {};

chrome.action.onClicked.addListener((tab) => {
    if (tabRefreshState[tab.id]) {
        stopAutoRefresh(tab.id);
        chrome.action.setIcon({ path: "icons8-inactive-48.png", tabId: tab.id });
    } else {
        startAutoRefresh(tab.id);
        chrome.action.setIcon({ path: "icons8-active-100.png", tabId: tab.id });
    }
});

function updateStorage() {
    chrome.storage.local.set({ tabRefreshState: tabRefreshState });
}


async function checkForNewCase(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: {
                tabId: tabId,
            },
            files: ["script.js"],
        });
    } catch (err) {
        console.error(`Failed to execute script: ${err}`);
    }
}

function startAutoRefresh(tabId) {
    tabRefreshState[tabId] = setInterval(() => {
        chrome.tabs.reload(tabId, () => {
            chrome.tabs.onUpdated.addListener(async function listener(updatedTabId, changeInfo) {
                if (updatedTabId === tabId && changeInfo.status === 'complete') {
                    await(sleep(10000))
                    await checkForNewCase(tabId)
                    chrome.action.setIcon({ path: "icons8-active-100.png", tabId: tabId });
                    chrome.tabs.onUpdated.removeListener(listener);
                    updateStorage();
                }
            });
        });
    }, 30*1000);
}

function stopAutoRefresh(tabId) {
    clearInterval(tabRefreshState[tabId]);
    delete tabRefreshState[tabId];
    updateStorage();
}

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabRefreshState[tabId]) {
        clearInterval(tabRefreshState[tabId]);
        delete tabRefreshState[tabId];
        updateStorage();
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}