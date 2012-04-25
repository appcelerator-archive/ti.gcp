var GCP = require('ti.gcp');

var win = Ti.UI.createWindow({
    backgroundColor: '#fff',
    layout: 'vertical'
});

/*
 Remote PDF printing.
 */
var printRemotePDF = Ti.UI.createButton({
    title: 'Print Remote PDF',
    height: 60,
    top: 20, right: 20, bottom: 20, left: 20
});
printRemotePDF.addEventListener('click', function () {
    GCP.open({
        title: 'Remote PDF',
        type: 'url', // Hint: the URL you specify must be internet accessible; local urls will not work!
        data: 'http://assets.appcelerator.com.s3.amazonaws.com/docs/Appcelerator-IDC-Q1-2011-Mobile-Developer-Report.pdf'
    });
});
win.add(printRemotePDF);

/*
 Local image printing.
 */
var printScreenshot = Ti.UI.createButton({
    title: 'Print Local PDF',
    height: 60,
    top: 20, right: 20, bottom: 20, left: 20
});
printScreenshot.addEventListener('click', function () {
    GCP.open({
        title: 'Local PDF',
        type: 'application/pdf',
        data: '' + Ti.Utils.base64encode(Ti.Filesystem.getFile('Appcelerator-IDC-Q1-2011-Mobile-Developer-Report.pdf').read()),
        encoding: 'base64'
    });
});
win.add(printScreenshot);

win.open();