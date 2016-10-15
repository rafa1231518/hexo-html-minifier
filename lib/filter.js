'use strict';

const jsdom = require('jsdom').jsdom;
const serializeDocument = require('jsdom').serializeDocument;
const minimatch = require('minimatch');

// mess with default jsdom features, for efficiency
jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : ['script'], // left at default. -- Enables/Disables fetching files over the filesystem/http
  ProcessExternalResources : false,      // Disabling this will disable script execution (currently only javascript).
  MutationEvents           : false,      // Initially enabled to be up to spec. Disable this if you do not need mutation events and want jsdom to be a bit more efficient.
  QuerySelector            : false       // disabled by default -- This feature is backed by sizzle but currently causes problems with some libraries. Enable this if you want document.querySelector and friends, but be aware that many libraries feature detect for this, and it may cause you a bit of trouble.
};
//////

module.exports = function(str, data){
  const options = this.config.html_minifier;
  const path = data.path;
  let exclude = options.exclude;
  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length){
    for (let i = 0, len = exclude.length; i < len; i++){
      if (minimatch(path, exclude[i])) return str;
    }
  }

  const document = jsdom(str, options ? (options.jsdom_options || {}) : {});
  //const window = document.defaultView;

  const result = serializeDocument(document);

  return result;
};