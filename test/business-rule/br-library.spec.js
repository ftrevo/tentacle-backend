// ----------------- Import de dependências ----------------- //
const should = require('should');

// --------------- Import de arquivos do core --------------- //
const brLibrary = require('../../business-rules/br-library');
const testUtil = require('../test-util');

describe('# Regra de negócio de Biblioteca', function () {

    describe('## Search', function () {

        it('id, nome e paginação', async function () {
            let requestMock = {
                'query': {
                    'name': 'Nome',
                    '_id': '1a1a1a1a1a1a2b2b2b2b2b2b',
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

            let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('endpoint', 'search');
            requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(8);
            requestMock.query.aggregate[0].should.be.eql({
                "$match": {
                    "$or": [
                        { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXbox360.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXboxOne.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendo3ds.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendoSwitch.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                    ],
                    "name": /Nome/i,
                    "_id": "1a1a1a1a1a1a2b2b2b2b2b2b"
                }
            });
            requestMock.query.aggregate[1].should.be.eql({ "$sort": { "name": 1 } });
            requestMock.query.aggregate[2].should.be.eql({
                "$project": {
                    'mediaPs3': {
                        '$filter': {
                            'input': "$mediaPs3", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaPs4': {
                        '$filter': {
                            'input': "$mediaPs4", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXbox360': {
                        '$filter': {
                            'input': "$mediaXbox360", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXboxOne': {
                        '$filter': {
                            'input': "$mediaXboxOne", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendo3ds': {
                        '$filter': {
                            'input': "$mediaNintendo3ds", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendoSwitch': {
                        '$filter': {
                            'input': "$mediaNintendoSwitch", 'as': "singleMedia",
                            'cond': {
                                '$eq': ["$$singleMedia.ownerState", '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    '_id': 1,
                    'createdAt': 1,
                    'name': 1
                }
            });
            requestMock.query.aggregate[3].should.be.eql({
                "$addFields": {
                    'mediaPs3Count': { $size: "$mediaPs3" },
                    'mediaPs4Count': { $size: "$mediaPs4" },
                    'mediaXbox360Count': { $size: "$mediaXbox360" },
                    'mediaXboxOneCount': { $size: "$mediaXboxOne" },
                    'mediaNintendo3dsCount': { $size: "$mediaNintendo3ds" },
                    'mediaNintendoSwitchCount': { $size: "$mediaNintendoSwitch" }
                }
            });
            requestMock.query.aggregate[4].should.be.eql({
                "$project": {
                    'mediaNintendo3ds': 0,
                    'mediaNintendoSwitch': 0,
                    'mediaPs3': 0,
                    'mediaPs4': 0,
                    'mediaXbox360': 0,
                    'mediaXboxOne': 0,
                }
            });
            requestMock.query.aggregate[5].should.be.eql({
                "$facet": {
                    'count': [{ '$count': "count" }],
                    'list': [{ '$skip': 0 }, { '$limit': 10 }]
                }
            });
            requestMock.query.aggregate[6].should.be.eql({ '$unwind': "$count" });
            requestMock.query.aggregate[7].should.be.eql({ '$addFields': { 'count': "$count.count" } });
        });

        describe('### Mídia', function () {

            it('uma única plataforma', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = testUtil.getBaseResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(1);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = testUtil.getBaseResponseMock();

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(2);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$ne': [] } },
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

        });
    });

    describe('## Search Home', function () {

        it('paginação', async function () {
            let requestMock = {
                'query': {
                    'page': 0,
                    'limit': 10
                }
            };

            let responseMock = testUtil.getBaseResponseMock();

            let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.not.have.property('page');
            requestMock.query.should.not.have.property('limit');
            responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
        });

        describe('### Mídia', function () {

            it('uma única plataforma', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = testUtil.getBaseResponseMock();

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(1);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = testUtil.getBaseResponseMock();

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('$or').with.lengthOf(2);
                requestMock.query.$or.should.containDeep([
                    { 'mediaPs3': { '$ne': [] } },
                    { 'mediaPs4': { '$ne': [] } }
                ]);
                requestMock.query.should.not.have.property('page');
                requestMock.query.should.not.have.property('limit');
                responseMock.locals.should.have.property('pagination', { 'skip': 0, 'max': 10 });
            });

        });
    });
});

// --------------------- Funções Locais --------------------- //
function getResponseMock(userState) {
    let mock = testUtil.getBaseResponseMock();

    mock.locals._USER.state = userState;

    return mock;
};

