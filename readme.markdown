traverson-hal
=============

HAL adapter for Traverson
-------------------------

[![Build Status](https://img.shields.io/travis/com/traverson/traverson-hal.svg?branch=master)](https://travis-ci.com/traverson/traverson-hal)
[![Dependency Status](https://david-dm.org/traverson/traverson-hal.png)](https://david-dm.org/traverson/traverson-hal)
[![NPM](https://nodei.co/npm/traverson-hal.png?downloads=true&stars=true)](https://nodei.co/npm/traverson-hal/)
[![Greenkeeper badge](https://badges.greenkeeper.io/traverson/traverson-hal.svg)](https://greenkeeper.io/)

| File Size (browser build) | KB  |
|---------------------------|----:|
| minified & gzipped        |  4  |
| minified                  | 12  |

Introduction
------------

traverson-hal is a [Traverson](https://github.com/traverson/traverson) plug-in that adds support for the JSON dialect of [HAL](http://tools.ietf.org/id/draft-kelly-json-hal-06), the hypertext application language to Traverson. Internally, traverson-hal uses [Halfred](https://github.com/traverson/halfred) to work with HAL resources.

While in theory you could use Traverson even without special support for HAL by specifying each link relation with JSONPath (like `$._links.linkName`) that would be quite cumbersome. traverson-hal makes working with HAL APIs in Traverson a breeze.

Installation
------------

### Node.js

    npm install traverson traverson-hal --save

### Browser

* If you are using npm and [Browserify](http://browserify.org/): Just `npm install traverson traverson-hal --save` and include `traverson` and `traverson-hal` via `require` (see below), then browserify your module as usual - browserify will include Traverson and its dependencies for you .
* Otherwise you can grab a download from the [latest release](https://github.com/traverson/traverson-hal/releases/latest). None of files includes Traverson itself, so you will also have to download a Traverson release.
    * `traverson-hal.min.js`: Minified build with UMD. This build can be used with an AMD loader like RequireJS or with a script tag (in which case it will register `TraversonJsonHalAdapter` in the global scope). **If in doubt, use this build.**
    * `traverson-hal.js`: Non-minified build with UMD. Same as above, just larger :-)
    * `traverson-hal.external.min.js`: Minified require/external build. Created with browserify's `--require` parameter and intended to be used (required) from other browserified modules, which were created with `--external traverson-hal`. This build could be used if you use browserify but do not want to bundle traverson-hal with your own browserify build but keep it as a separate file.
    * `traverson-hal.external.js`: Non-minified require/external build, same as before, just larger.

### Version Compatibility

| For traverson-hal | Use Traverson   |
|:------------------|:----------------|
| 1.0.0             | 1.0.0           |
| 1.1.0             | 1.1.0           |
| 1.2.0             | 1.2.1           |
| 2.0.0             | 2.0.0, 2.0.1    |
| 2.0.1             | 2.0.0, 2.0.1    |
| 2.1.0             | 2.1.0           |
| 3.0.0             | 2.1.0           |
| 4.0.0             | 3.0.0           |
| 4.1.1             | 3.1.0-3.2.0     |
| 5.0.0             | 5.0.0           |
| 6.0.0             | 6.0.1           |
| 6.0.1             | 6.0.4           |
| 6.0.2             | 6.0.4           |

Usage
-----

```javascript
// require traverson and traverson-hal
var traverson = require('traverson');
var JsonHalAdapter = require('traverson-hal');

// register the traverson-hal plug-in for media type 'application/hal+json'
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);

// use Traverson to follow links, as usual
traverson
.from('http://api.io')
.jsonHal()
.follow('ht:me', 'ht:posts')
.getResource(function(error, document) {
  if (error) {
    console.error('No luck :-)')
  } else {
    console.log('We have followed the path and reached our destination.')
    console.log(JSON.stringify(document))
  }
});
```

Working with HAL resources
--------------------------

Here is a more thorough explanation of the introductory example:

<pre lang="javascript">
var traverson = require('traverson');
var JsonHalAdapter = require('traverson-hal');

// register the traverson-hal plug-in for media type 'application/hal+json'
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);

traverson
.from('http://haltalk.herokuapp.com/')
<b>.jsonHal()</b>
.withTemplateParameters({name: 'traverson'})
.follow('ht:me', 'ht:posts')
.getResource(function(error, document) {
  if (error) {
    console.error('No luck :-)')
  } else {
    console.log(JSON.stringify(document))
  }
});
</pre>

```
http://haltalk.herokuapp.com/
{
  "_links": {
    "self": {
      "href": "/"
    },
    "curies": [ ... ],
    "ht:users": {
      "href": "/users"
    },
    "ht:me": {
      "href": "/users/{name}",
      "templated": true
    }
  }
}

http://haltalk.herokuapp.com/users/traverson
{
  "_links": {
    "self": {
      "href": "/users/traverson"
    },
    "curies": [ ... ],
    "ht:posts": {
      "href": "/users/traverson/posts"
    }
  },
  "username": "traverson",
  "real_name": "Bastian Krol"
}

http://haltalk.herokuapp.com/users/traverson/posts
{
  "_links": {
    "self": { "href": "/users/traverson/posts" },
    "curies": [ ... ],
    "ht:author": { "href": "/users/traverson" }
  },
  "_embedded": {
    "ht:post": [
      {
        "_links": { "self": { "href": "/posts/526a56454136280002000015" },
          "ht:author": { "href": "/users/traverson", "title": "Bastian Krol" }
        },
        "content": "Hello! I'm Traverson, the Node.js module to work with hypermedia APIs. ...",
        "created_at": "2013-10-25T11:30:13+00:00"
      },
      {
        "_links": { "self": { "href": "/posts/526a58034136280002000016" },
          "ht:author": { "href": "/users/traverson", "title": "Bastian Krol" }
        },
        "content": "Hello! I'm Traverson, the Node.js module to work with hypermedia APIs. You can find out more about me at https://github.com/traverson/traverson. This is just a test post. @mikekelly: Don't worry, this tests will only be run manually a few times here and there, I'll promise to not spam your haltalk server too much :-)",
        "created_at": "2013-10-25T11:37:39+00:00"
      },
      ...
    ]
  }
}
```

This will give you all posts that the account `traverson` posted to Mike Kelly's haltalk server. Note that we called `jsonHal()` on Traverson's request builder (the object returned from `traverson.from(...)` instead of the usual `traverson.from(...).json()`. When called in this way, Traverson will assume the resources it receives comply with the HAL specification and looks for links in the `_links` property. If there is no such link, traverson-hal will also look for an embedded resource with the given name. You can omit the method call to `jsonHal()` and rely on content type detection when you are sure that the server always sets the HTTP header `Content-Type: application/hal+json` in its responses. However, some HAL APIs use `Content-Type: application/json` in their responses although the return HAL resources.

### Selecting From A Collection Of Resources

The HAL specification explicitly allows the values in the `_links` object to be _"either a Link Object or an array of Link Objects"_. If there is an array of link objects, this corresponds to multiple resources that have the same link relation. In these cases it is often necessary to be more specific about which link to use when there is an array of links for the link relation in question.

#### Secondary Key

Section 5.5 of the HAL specification introduces the `name` property of link objects which _"MAY be used as a secondary key for selecting Link Objects which share the same relation type."_

You can pass strings like `'ht:post[name:foo]'` to the `follow` method to select links from an array by this secondary key, that is, by the `name` attribute of the link object. In fact, traverson-hal allows **any** attribute of the link object to be used as a secondary key in this manner, not only the `name` attribute.

Let's look at an example:

```
'_links': {
  'ht:post': [{
    'href': '/posts/2',
    'title': 'A Blogpost About Nothing In Particular',
    'name': 'bar'
  }, {
    'href': '/posts/7',
    'title': 'Traverson For Dummies',
    'name': 'foo'
  }]
}
```

With `'ht:post[name:foo]'`, the second link from that array would be selected and the resource at URL `/posts/7` would be fetched.

As said, in contrast to the spec, with traverson-hal you are not restricted to the `name` attribute. Let's look at another example:

```
'_links': {
  'ht:post': [{
    'href': '/posts/2',
    'title': 'A Blogpost About Nothing In Particular',
    'id': 'post-about-nothing'
  }, {
    'href': '/posts/7',
    'title': 'Traverson For Dummies',
    'id': 'traverson-for-dummies'
  }]
}
```

With `'ht:post[id:traverson-for-dummies]'`, the second link from that array would be selected and the resource at URL `/posts/7` would be fetched.

Note: You can also use the secondary key notation `'ht:post[name:foo]'` to target individual elements in an array of embedded resources (see below).

#### Array Index

Because multiple links with the same link relation type are represented as an array of link objects in HAL, you can also use an array indexing notation like `'ht:post[1]'` to select an individual elements from an array of link objects. Array indices are zero based, the example `'ht:post[1]'` would use the second element from the array of posts (see above).

However, this is not recommended and should only be used as a last resort if the API does not provide a secondary key to select the correct link, because it relies on the ordering of the links as returned from the server, which might not be guaranteed to be always the same.

Note: You can also use the array indexing notation `'ht:post[1]'` to target individual elements in an array of embedded resources (see below).

#### Using The First Link Arbitrarily

If there is an array of links and neither a secondary key nor an array index have been specified, traverson-hal arbitrarily chooses the first link from the array.


### Embedded Documents

When working with HAL resources, for each link given to the `follow` method, traverson-hal checks the `_links` object. If the `_links` object does not have the property in question, traverson-hal also automatically checks the embedded document (the `_embedded` object). If there is an embedded document with the correct property key, this one will be used instead. If there is both a `_link` and an `_embedded` object with the same name, traverson-hal will prefer the link by default, not the embedded object (reason: the spec says that an embedded resource may "be a full, partial, or inconsistent version of the representation served from the target URI", so to get the complete and up to date document your best bet is to follow the link to the actual resource, if available). This behaviour can be configured by calling `preferEmbeddedResources()` on the request builder object, which will make traverson-hal prefer the embedded resource over following a link.

#### Selecting From A Collection Of Embedded Resources

Link relations can denote a single embedded document as well as an array of embedded documents. Therefore, the same mechanisms that are used to select an individual link from an array of link objects can also be used with embedded arrays. That is, you can always use `'ht:post[name:foo]'`, `'ht:post[id:traverson-for-dummies]'`, or `'ht:post[1]'`, no matter if the link relation is present in the `_links` object or in the `_embedded` object.

#### Using The First Embedded Resource Arbitrarily

If there is an array of embedded resources and neither a secondary key nor an array index have been specified, traverson-hal arbitrarily chooses the first resource from the array.

#### The $all Meta Selector

For embedded arrays you can additionally use the meta selector `$all`, which operates on embedded documents: If you pass `ht:post[$all]` to the `follow` method, you receive the complete array of posts, not an individual post resource. A link relation containing `$all` must only be passed as the last element to `follow` and it only works for embedded documents. Futhermore, it can only be used with `get` and `getResource`, not with `post`, `put`, `delete`, `patch` or `getUri`.  To provide a uniform shape for handlers, $all will always provide an array result, containing 0 or more matching embedded objects. NOTE: this means than using a non-existing link relation with `$all` will not generate errors -- they will produce empty arrays instead.


### HAL and JSONPath

JSONPath (a feature supported in Traverson core) is not supported when working with HAL resources. It would also make no sense because in a HAL resource there is only one place in the document that contains all the links.

### Errors

`JsonHalAdapter.errors` is a map of error names that are used by traverson-hal. Whenever traverson-hal creates an `Error` object, the `name` property of the `Error` object will be set to one of the values of this map. The following error keys and values will be used:

* `InvalidArgumentError: 'InvalidArgumentError'`: When an invalid argument is passed to a method.
* `InvalidStateError: 'InvalidStateError'`: When traverson-hal encounters an invalid state during the traversal.
* `LinkError: 'HalLinkError'`: When traverson-hal is unable to follow a link.
* `LinkMissingOrInvalidError: 'HalLinkMissingOrInvalidError'`: When a link given to traverson-hal for the link traversal process can not be found or is invalid.
* `EmbeddedDocumentsError: 'HalEmbeddedDocumentsError'`: When an embedded document that is expected to be present and that is required for the traversal process is not present.


Contributing
------------

See [Contributing to traverson-hal](https://github.com/traverson/traverson-hal/blob/master/CONTRIBUTING.md).


Code of Conduct
---------------

See [Code of Conduct](https://github.com/traverson/traverson-hal/blob/master/CODE_OF_CONDUCT.md).


Release Notes
-------------

See [CHANGELOG](https://github.com/traverson/traverson-hal/blob/master/CHANGELOG.md).


License
-------

MIT
