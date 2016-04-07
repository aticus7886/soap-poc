'use strict';

//Utilisation du wsdl directement dans l'application
var wsdlurl = './lib/weather.wsdl';
//Utilisation du wsdl en le récupérant via l'url
var wsdl = 'http://www.webservicex.net/globalweather.asmx?WSDL';
var soap = require('soap');
var xml2js = require('xml2js');
var xmlParser = xml2js.Parser({ explicitArray: false, attrkey: '@', charkey: '#', tagNameProcessors: [xml2js.processors.stripPrefix] });


/**
 * Creation d'un client SOAP à l'aide d'un wsdl d'exemple tiré de http://www.webservicex.net/
 * Ce site possède une api disponible qu'on peut appeler en REST ou en SOAP
 * On utilisera pour ce poc l'api globaleWeather (http://www.webservicex.net/globalweather.asmx?WSDL) qui expose :
 * - GetCitiesByCountry
 */

module.exports.getCitiesByCountry = (city) => {
    return new Promise((resolve, reject) => {
        var cityParam = {
            CountryName : city
        };

        // On crée le client a partir du wsdl
        return soap.createClient(wsdlurl, (err, client) => {
            //On appelle le service souhaité
            return client.GetCitiesByCountry(cityParam, (err, result, body) => {
                console.log(decodeXml(body));
                //On convertit le résultat en Json
                return convertXmlToJson(result.GetCitiesByCountryResult)
                    .then((json) => {
                        return resolve(json);
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            });
        });
    });
};

var escaped_one_to_xml_special_map = {
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>'
};

function decodeXml(string) {
    return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        function(str, item) {
            return escaped_one_to_xml_special_map[item];
        });
}

/**
 * This method convert an xml object to an json object
 *
 * @param {string} xml The xml object we need to convert
 * @returns {Promise} - Return a promise containing the json object transformed from xml object
 */
const convertXmlToJson = (xml) => {
    return new Promise(function (resolve, reject) {
        xmlParser.parseString(xml, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

