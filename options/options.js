var $txtBaseUrl, $txtTicketPrefix, $selectOpenNewTab, $btnSave;
$(document).ready(function () {
   

    $txtBaseUrl = $("#txtBaseUrl");
    $txtTicketPrefix = $("#txtTicketPrefix");
    $selectOpenNewTab = $("#selectNewTab");
    $btnSave = $("#btnSave");

    restore_options();
    bindEventListeners();
    $(document).foundation();
});
function bindEventListeners() {
    
    // Save
    $btnSave.on('click', function () {
       
        save_options();
    });
}

// Saves options to chrome.storage
function save_options() {
    var baseUrl = $txtBaseUrl.val();
    var ticketPrefix = $txtTicketPrefix.val();
    var openInNewTab = $selectOpenNewTab.val();

    chrome.storage.sync.set({
        baseUrl: baseUrl,
        ticketPrefix: ticketPrefix,
        openInNewTab: openInNewTab
    }, function () {
        closeOptionsTab();
        });
}
function closeOptionsTab() {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.remove(tab.id);
    });
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        baseUrl: 'https://mycompany.atlassian.net/',
        ticketPrefix: '',
        openInNewTab: 'true'
    }, function (settings) {
        console.log(settings)
        $txtBaseUrl.val(settings.baseUrl);
        $txtTicketPrefix.val(settings.ticketPrefix);
        console.log(settings.openInNewTab);
        if (settings.openInNewTab == 'false') {
            $('#selectNewTab').val('false');
        }
    });
}
