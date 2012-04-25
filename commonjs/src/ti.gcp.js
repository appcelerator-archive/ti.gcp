// Public API
var GCP = exports || {};
GCP.open = open;
GCP.close = close;

// Private Instance Variables
var win = null;
var container = null;
var web = null;
var progressContainer = null;
var progress = null;

var isFirstLoad = true;
var isAlreadyLoading = false;
var loadingEstimates = JSON.parse(Ti.App.Properties.getString('GCP-LoadingEstimates', '{}'));
var currentLoadingEstimateID;
var loadingStartMS;
var loadingIntervalID = 0;

var printOptions;

function open(options) {
    if (!options) {
        alert('Please provide print options!');
        return;
    }
    printOptions = options;
    win = Ti.UI.createWindow({
        backgroundColor: 'transparent'
    });
    if (!Ti.Android) {
        win.opacity = 0;
        win.transform = Ti.UI.create2DMatrix().scale(0)
    }
    container = Ti.UI.createView({
        bottom: 30,
        backgroundColor: '#777',
        zIndex: -1
    });
    var closeLabel = Ti.UI.createButton({
        font: { fontSize: 11, fontWeight: 'bold' },
        backgroundColor: '#777',
        borderColor: '#777',
        color: '#fff',
        style: 0,
        title: options.closeTitle || 'Return to App',
        right: 0, bottom: 0, left: 0,
        height: 30
    });
    closeLabel.addEventListener('click', close);
    win.open();

    var offset = 0;
    if (Ti.Android) {
        offset = '10dp';
    }

    progressContainer = Ti.UI.createView({
        top: offset, right: offset, bottom: offset, left: offset,
        backgroundColor: '#fff'
    });
    progress = Ti.UI.createProgressBar({
        top: 10, right: 10, bottom: 10, left: 10,
        min: 0, max: 1, value: 0.5,
        message: 'Loading, please wait.',
        backgroundColor: '#fff',
        font: { fontSize: 14, fontWeight: 'bold' },
        style: 0
    });
    container.add(progressContainer);
    progressContainer.add(progress);
    progress.show();

    win.add(container);
    win.add(closeLabel);

    if (!Ti.Android) {
        var tooBig = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix().scale(1.1),
            opacity: 1,
            duration: 350
        });
        var shrinkBack = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix(),
            duration: 400
        });
        tooBig.addEventListener('complete', function () {
            win.animate(shrinkBack);
        });
        win.animate(tooBig);
    }
    // Kick off the timer.
    onBeforeLoad();

    web = Ti.UI.createWebView({
        url: 'https://www.google.com/cloudprint/dialog.html',
        top: offset, right: offset, bottom: offset, left: offset
    });
    web.addEventListener('load', onLoad);
    web.addEventListener('beforeload', onBeforeLoad);
    container.add(web);
}

function close() {
    if (win == null)
        return;

    try {
        web.removeEventListener('load', onLoad);
        web.removeEventListener('beforeload', onBeforeLoad);
        progress.hide();
        win.close();
        isAlreadyLoading = null;
        web = null;
        progress = null;
        isAlreadyLoading = false;
        isFirstLoad = true;
        container = null;
        win = null;
    }
    catch (ex) {
        Ti.API.error('Cannot close the dialog. Ignoring. ' + ex);
    }
}

var haveInjectedJob = false;

function onLoad(e) {
    if (!haveInjectedJob) {
        var title = printOptions.title || 'New Print Job';
        var type = printOptions.type || 'url';
        var data = '' + (printOptions.data || '');
        var encoding = 'undefined';
        if (printOptions.encoding) {
            encoding = '"' + printOptions.encoding + '"';
        }
        e.source.evalJS('window.addEventListener("message", function(evt){ alert(evt); }, false)');
        e.source.evalJS('printDialog.setPrintDocument(printDialog.createPrintDocument(\
            "' + type + '",\
            "' + title + '",\
            "' + data.split('\r\n').join('|^|') + '".split("|^|").join("\\r\\n"),\
            ' + encoding + ')\
        )');
        haveInjectedJob = true;
    }

    //var response = e.source.evalJS('(p = document.getElementById("oauth_pin")) && p.innerHTML;');
    if (false) {
        //alert(response);
        //close();
    }
    else {
        progress && progress.hide();
        progressContainer && progressContainer.hide();
        web && web.show();
    }
    isAlreadyLoading = false;
    clearInterval(loadingIntervalID);
    loadingEstimates[currentLoadingEstimateID] = new Date().getTime() - loadingStartMS;
    Ti.App.Properties.setString('Social-LoadingEstimates', JSON.stringify(loadingEstimates));
}

function onBeforeLoad() {
    if (isAlreadyLoading)
        return;
    isAlreadyLoading = true;
    progress.value = 0;
    currentLoadingEstimateID = 'pageLoad';
    if (!loadingEstimates[currentLoadingEstimateID]) {
        loadingEstimates[currentLoadingEstimateID] = isFirstLoad ? 2000 : 1000;
    }
    isFirstLoad = false;
    loadingStartMS = new Date().getTime();
    loadingIntervalID = setInterval(updateProgress, 30);
    web && web.hide();
    progress && progress.show();
    progressContainer && progressContainer.show();
}

function updateProgress() {
    progress && (progress.value = (new Date().getTime() - loadingStartMS) / loadingEstimates[currentLoadingEstimateID]);
}