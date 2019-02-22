# Usage

1. Set up and start the local server (*[Instructions](https://github.com/salembeats/DistantForage/blob/master/DistantForage-server/README.md)*).

2. In your userscript, @require `https://raw.githubusercontent.com/salembeats/DistantForage/master/DistantForage-client-library/requireMe.js`.

3. Create a new `DistantForage` like so:

```js
const distantForage = new DistantForage(/* You can optionally specify a URL for the API's base path here if you're hosting the API server on a different computer/port/protocol than the default. */);
```

4. Use the set/get behavior of this instance of `DistantForage` in the same way you'd use [localForage](https://github.com/localForage/localForage).

# Known Issues

Chrome *(and many other browsers)* may complain about mixed HTTP/HTTPS content and ultimately block API requests if you use the default HTTP implementation of the server on an HTTPS page.
In the current version of Chrome, you can click the *"shield"* icon on the right edge of the page URL field and choose *"load unsafe scripts"* in order to allow this mixed HTTPS/HTTP content.
A version of this library which uses `GM_xmlhttpRequest` rather than `fetch` might be written in the near future in order to overcome this hassle.
