/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/* global describe, it, beforeEach */
'use strict';
var expect = require('chai').expect;
var DocStore = require('../../../stores/DocStore');

describe('doc store', function () {
    var storeInstance;
    var doc1 = {
        key: '/docs/quick-start.md',
        content: '<h1>Quick Start</h1>',
        title: 'Quick Start'
    };
    var doc2 = {
        key: '/docs/slow-start.md',
        content: '<h1>Slow Start</h1>',
        title: 'Slow Start'
    };


    beforeEach(function () {
        storeInstance = new DocStore();
    });

    it('should instantiate correctly', function (done) {
        expect(storeInstance).to.be.an('object');
        expect(storeInstance.docs).to.be.an('object');
        expect(storeInstance.current).to.be.an('object');
        done();
    });

    it('should receive a doc', function (done) {
        storeInstance._receiveDoc(doc1);
        expect(Object.keys(storeInstance.docs).length).to.equal(1);
        done();
    });

    it('should skip receiving a malformatted doc', function (done) {
        var badDoc = {
            foo: 'bar'
        };

        storeInstance._receiveDoc(badDoc);
        expect(Object.keys(storeInstance.docs).length).to.equal(0);
        done();
    });

    it('should get a doc by key', function (done) {
        storeInstance._receiveDoc(doc1);
        expect(storeInstance.get(doc1.key)).to.equal(doc1);
        done();
    });

    it('should get all the docs', function (done) {
        storeInstance._receiveDoc(doc1);
        storeInstance._receiveDoc(doc2);

        expect(Object.keys(storeInstance.getAll()).length).to.equal(2);
        done();
    });

    it('should get the current doc', function (done) {
        storeInstance._receiveDoc(doc1);
        expect(storeInstance.getCurrent()).to.equal(doc1);
        done();
    });

    it('should dehydrate', function (done) {
        storeInstance._receiveDoc(doc1);
        var state = storeInstance.dehydrate();

        expect(state.docs).to.be.an('object');
        expect(state.current).to.be.an('object');
        done();
    });

    it('should rehydrate', function (done) {
        var state = {
            docs: {},
            current: undefined
        };
        state.docs[doc1.key] = doc1;
        state.docs[doc2.key] = doc2;
        state.current = doc2;
        storeInstance.rehydrate(state);

        expect(storeInstance.docs).to.equal(state.docs);
        expect(storeInstance.current).to.equal(state.current);
        done();
    });
});

