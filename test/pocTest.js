/* global describe it */
"use strict";

const expect = require('chai').expect;
const clientSoap = require('../lib/clientSoap');
const util = require('util');
const nock = require('nock');

describe.only('Test du client SOAP', () => {
    const soapResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetCitiesByCountryResponse xmlns="http://www.webserviceX.NET"><GetCitiesByCountryResult><NewDataSet><Table><Country>France</Country><City>Levallois</City></Table></NewDataSet></GetCitiesByCountryResult></GetCitiesByCountryResponse></soap:Body></soap:Envelope>'
    before(() => {
        nock('http://www.webservicex.net')
            .post('/globalweather.asmx')
            .reply(201, soapResponse, {
                'Content-Type': 'application/xml'
            });
    });

    it("it should return cities list in a JSON format", (done) => {
        clientSoap.getCitiesByCountry("FRANCE")
        .then((json) => {
            console.log(util.inspect(json, false, null));
            done();
        })
        .catch((err) => {
            console.log(err);
        });
    });
});



