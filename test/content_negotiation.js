'use strict';

var traverson = require('traverson')
  , JsonHalAdapter = require('..')
  , waitFor = require('poll-forever')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , assert = chai.assert
  , expect = chai.expect;

chai.use(sinonChai);

describe('Content negotiation', function() {

  var api
    , callback
    , firstUri
    , get
    , mockResponse
    , rootResponse
    , rootUri = 'http://api.io'
    , client = traverson.from(rootUri)
    , secondResponse
    , secondUri
    , thirdResponse;

  before(function() {
    traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
  });

  after(function() {
    // de-register HAL plug-in to leave Traverson in a clean state for other
    // tests
    traverson.registerMediaType(JsonHalAdapter.mediaType, null);
  });

  beforeEach(function() {
    api = client.newRequest();
    get = sinon.stub();
    api.requestModuleInstance = { get: get };
    callback = sinon.spy();

  });

  describe('with application/json', function() {

    beforeEach(function() {
      mockResponse =
        require('traverson-mock-response')('application/json ; charset=utf-8');
      firstUri = rootUri + '/first';
      secondUri = rootUri + '/second';
      rootResponse = mockResponse({ first: firstUri, });
      secondResponse = mockResponse({ second: secondUri });
      thirdResponse = mockResponse({ content: 'awesome' });

      get
      .withArgs(rootUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, rootResponse, rootResponse.body);
      get
      .withArgs(firstUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, secondResponse, secondResponse.body);
      get
      .withArgs(secondUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, thirdResponse, thirdResponse.body);
    });

    it('should recognize the media type as application/json', function(done) {
      api
      .follow('first', 'second')
      .getResource(callback);
      waitFor(
        function() { return callback.called; },
        function() {
          expect(callback).to.have.been.calledWith(null, {
            content: 'awesome'
          });
          done();
        }
      );
    });
  });

  describe('with application/hal+json', function() {
    beforeEach(function() {
      mockResponse = require('traverson-mock-response')('application/hal+json');
      firstUri = rootUri + '/first';
      secondUri = rootUri + '/second';
      rootResponse = mockResponse({
        _links: {
          first: { href: firstUri },
        }
      });
      secondResponse = mockResponse({
        _links: {
          second: { href: secondUri },
        }
      });
      thirdResponse = mockResponse({ content: 'awesome' });

      get
      .withArgs(rootUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, rootResponse, rootResponse.body);
      get
      .withArgs(firstUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, secondResponse, secondResponse.body);
      get
      .withArgs(secondUri, sinon.match.any, sinon.match.func)
      .callsArgWithAsync(2, null, thirdResponse, thirdResponse.body);
    });

    it('should recognize the media type as application/hal+json',
        function(done) {
      api
      .follow('first', 'second')
      .getResource(callback);
      waitFor(
        function() { return callback.called; },
        function() {
          expect(callback).to.have.been.calledWith(null, {
            content: 'awesome'
          });
          done();
        }
      );
    });
  });

});
