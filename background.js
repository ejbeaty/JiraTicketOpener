chrome.browserAction.onClicked.addListener(function (tab) {
    getOptions().then(function (options) {
        if (typeof options === 'undefined' ||
            options === null ||
            typeof options.baseUrl === 'undefined' ||
            options.baseUrl === null ||
            options.baseUrl.length < 2) { 
            promptToNavigateToOptions();
        } else {
            //Navigate to ticket
            var ticket = window.prompt("Please enter the JIRA ticket number", "Example: pd-117 or simply 117");
            navigateToTicket(ticket, options);
        }
    });; 
});
function getSanitizedBaseUrl(url) {

    if (typeof url === 'undefined' || url === null) {
        throw Error("Url is null or undefined!");
    }
    // check for http
    if (url.indexOf('http') === -1) {
        url = 'http://' + url;
    }
    // check for tailing slash
    var lastCharacter = url.substr(url.length - 1);
    if (lastCharacter !== '/') {
        url = url + '/';
    }
    return url;
}
function promptToNavigateToOptions() {
    if (confirm('You need to configure this plugin first. Would you like to do that now?')) {
        chrome.tabs.create({
            url: '/options/options.html'
        });
    } else {
        return;
    }
}

function navigateToTicket(ticket, options) {
    if (typeof ticket !== 'undefined' && ticket !== null) {
        // If only a number was entered, prepend "pd-"
        if (isNaN(ticket) == false) {
            ticket = options.ticketPrefix + "-" + ticket;
        }
        var url = getSanitizedBaseUrl(options.baseUrl) + "browse/" + ticket;
        if (options.openInNewTab == 'true') {
            chrome.tabs.create({
                url: url
            });
        } else {
            chrome.tabs.update({
                url: url
            });
        }

    }
}
function getOptions() {
    return new Promise(function (successCallback) {
        chrome.storage.sync.get(function (settings) {
            var options = new Options(settings.baseUrl, settings.ticketPrefix, settings.openInNewTab);
            successCallback(options);
        });
    });
   
}
function Options(baseUrl, ticketPrefix, openInNewTab) {
    var self = this;
    self.baseUrl = baseUrl;
    self.ticketPrefix = ticketPrefix;
    self.openInNewTab = openInNewTab;
    return self;
}
