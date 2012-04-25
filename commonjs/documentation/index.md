# Ti.GCP Module

Provides access to Google Cloud Print.

## Methods

### void open(args)
Opens a print dialog with the provided arguments. This dialog lets the user authenticate and print a document.

Takes a dictionary with the following arguments:

* string title [optional]: The title for the document. Defaults to "New Print Job".
* string type [optional]: The type of the data you will provide. Defaults to "url". Best supports "url" and "application/pdf", but you can also try "image/jpg" and "image/png".
* string data: The data for the document to be printed. If you specified "url" for the "type" property, this should be set to a URL accessible from the internet. If you specified another type, then this should be a base64 encoded string. Check out the example to see how to base64 encode a PDF.
* string encoding [optional]: If specified, this must be 'base64'. Otherwise, do not provide this property. (Hint: "url" type data should not specify this property!)
* string closeTitle [optional]: The title to display on the close button at the bottom of the view. Defaults to "Return to App".

### void close()
Closes any open dialog.

## Author

Dawson Toth

## License

Copyright(c) 2011-2012 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.
