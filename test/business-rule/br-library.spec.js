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
                $match: {
                    $or: [
                        { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXbox360.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXboxOne.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendo3ds.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendoSwitch.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                    ],
                    'name': /Nome/i,
                    '_id': '1a1a1a1a1a1a2b2b2b2b2b2b'
                }
            });
            requestMock.query.aggregate[1].should.be.eql({ $sort: { 'name': 1 } });
            requestMock.query.aggregate[2].should.be.eql({
                $project: {
                    'mediaPs3': {
                        $filter: {
                            'input': '$mediaPs3', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaPs4': {
                        $filter: {
                            'input': '$mediaPs4', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXbox360': {
                        $filter: {
                            'input': '$mediaXbox360', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXboxOne': {
                        $filter: {
                            'input': '$mediaXboxOne', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendo3ds': {
                        $filter: {
                            'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendoSwitch': {
                        $filter: {
                            'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    '_id': 1,
                    'createdAt': 1,
                    'name': 1
                }
            });
            requestMock.query.aggregate[3].should.be.eql({
                $addFields: {
                    'mediaPs3Count': { $size: '$mediaPs3' },
                    'mediaPs4Count': { $size: '$mediaPs4' },
                    'mediaXbox360Count': { $size: '$mediaXbox360' },
                    'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                    'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                    'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                }
            });
            requestMock.query.aggregate[4].should.be.eql({
                $project: {
                    'mediaNintendo3ds': 0,
                    'mediaNintendoSwitch': 0,
                    'mediaPs3': 0,
                    'mediaPs4': 0,
                    'mediaXbox360': 0,
                    'mediaXboxOne': 0
                }
            });
            requestMock.query.aggregate[5].should.be.eql({
                $facet: {
                    'count': [{ $count: 'count' }],
                    'list': [{ $skip: 0 }, { '$limit': 10 }]
                }
            });
            requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
            requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
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

                let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

                let nextObject = await brLibrary.search(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('endpoint', 'search');
                requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(8);
                requestMock.query.aggregate[0].should.be.eql({ $match: { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' } });
                requestMock.query.aggregate[1].should.be.eql({ $sort: { 'name': 1 } });
                requestMock.query.aggregate[2].should.be.eql({
                    $project: {
                        'mediaPs3': {
                            $filter: {
                                'input': '$mediaPs3', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaPs4': {
                            $filter: {
                                'input': '$mediaPs4', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXbox360': {
                            $filter: {
                                'input': '$mediaXbox360', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXboxOne': {
                            $filter: {
                                'input': '$mediaXboxOne', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendo3ds': {
                            $filter: {
                                'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendoSwitch': {
                            $filter: {
                                'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        '_id': 1,
                        'createdAt': 1,
                        'name': 1
                    }
                });
                requestMock.query.aggregate[3].should.be.eql({
                    $addFields: {
                        'mediaPs3Count': { $size: '$mediaPs3' },
                        'mediaPs4Count': { $size: '$mediaPs4' },
                        'mediaXbox360Count': { $size: '$mediaXbox360' },
                        'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                        'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                        'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                    }
                });
                requestMock.query.aggregate[4].should.be.eql({
                    $project: {
                        'mediaNintendo3ds': 0,
                        'mediaNintendoSwitch': 0,
                        'mediaPs3': 0,
                        'mediaPs4': 0,
                        'mediaXbox360': 0,
                        'mediaXboxOne': 0
                    }
                });
                requestMock.query.aggregate[5].should.be.eql({
                    $facet: {
                        'count': [{ $count: 'count' }],
                        'list': [{ $skip: 0 }, { '$limit': 10 }]
                    }
                });
                requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
                requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
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
                    $match: {
                        $or: [
                            { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                            { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                        ]
                    }
                });
                requestMock.query.aggregate[1].should.be.eql({ $sort: { 'name': 1 } });
                requestMock.query.aggregate[2].should.be.eql({
                    $project: {
                        'mediaPs3': {
                            $filter: {
                                'input': '$mediaPs3', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaPs4': {
                            $filter: {
                                'input': '$mediaPs4', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXbox360': {
                            $filter: {
                                'input': '$mediaXbox360', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXboxOne': {
                            $filter: {
                                'input': '$mediaXboxOne', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendo3ds': {
                            $filter: {
                                'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendoSwitch': {
                            $filter: {
                                'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        '_id': 1,
                        'createdAt': 1,
                        'name': 1
                    }
                });
                requestMock.query.aggregate[3].should.be.eql({
                    $addFields: {
                        'mediaPs3Count': { $size: '$mediaPs3' },
                        'mediaPs4Count': { $size: '$mediaPs4' },
                        'mediaXbox360Count': { $size: '$mediaXbox360' },
                        'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                        'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                        'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                    }
                });
                requestMock.query.aggregate[4].should.be.eql({
                    $project: {
                        'mediaNintendo3ds': 0,
                        'mediaNintendoSwitch': 0,
                        'mediaPs3': 0,
                        'mediaPs4': 0,
                        'mediaXbox360': 0,
                        'mediaXboxOne': 0
                    }
                });
                requestMock.query.aggregate[5].should.be.eql({
                    $facet: {
                        'count': [{ $count: 'count' }],
                        'list': [{ $skip: 0 }, { '$limit': 10 }]
                    }
                });
                requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
                requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
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

            let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

            let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('endpoint', 'home');
            requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(8);
            requestMock.query.aggregate[0].should.be.eql({
                $match: {
                    $or: [
                        { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXbox360.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXboxOne.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendo3ds.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendoSwitch.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                    ]
                }
            });
            requestMock.query.aggregate[1].should.be.eql({ $sort: { 'createdAt': -1 } });
            requestMock.query.aggregate[2].should.be.eql({
                $project: {
                    'mediaPs3': {
                        $filter: {
                            'input': '$mediaPs3', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaPs4': {
                        $filter: {
                            'input': '$mediaPs4', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXbox360': {
                        $filter: {
                            'input': '$mediaXbox360', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXboxOne': {
                        $filter: {
                            'input': '$mediaXboxOne', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendo3ds': {
                        $filter: {
                            'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendoSwitch': {
                        $filter: {
                            'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    '_id': 1,
                    'createdAt': 1,
                    'name': 1,
                    'aggregated_rating': 1,
                    'summary': 1,
                    'screenshots': 1
                }
            });
            requestMock.query.aggregate[3].should.be.eql({
                $addFields: {
                    'mediaPs3Count': { $size: '$mediaPs3' },
                    'mediaPs4Count': { $size: '$mediaPs4' },
                    'mediaXbox360Count': { $size: '$mediaXbox360' },
                    'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                    'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                    'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                }
            });
            requestMock.query.aggregate[4].should.be.eql({
                $project: {
                    'mediaNintendo3ds': 0,
                    'mediaNintendoSwitch': 0,
                    'mediaPs3': 0,
                    'mediaPs4': 0,
                    'mediaXbox360': 0,
                    'mediaXboxOne': 0
                }
            });
            requestMock.query.aggregate[5].should.be.eql({
                $facet: {
                    'count': [{ $count: 'count' }],
                    'list': [{ $skip: 0 }, { '$limit': 10 }]
                }
            });
            requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
            requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
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

                let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('endpoint', 'home');
                requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(8);
                requestMock.query.aggregate[0].should.be.eql({ $match: { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' } });
                requestMock.query.aggregate[1].should.be.eql({ $sort: { 'createdAt': -1 } });
                requestMock.query.aggregate[2].should.be.eql({
                    $project: {
                        'mediaPs3': {
                            $filter: {
                                'input': '$mediaPs3', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaPs4': {
                            $filter: {
                                'input': '$mediaPs4', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXbox360': {
                            $filter: {
                                'input': '$mediaXbox360', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXboxOne': {
                            $filter: {
                                'input': '$mediaXboxOne', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendo3ds': {
                            $filter: {
                                'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendoSwitch': {
                            $filter: {
                                'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        '_id': 1,
                        'createdAt': 1,
                        'name': 1,
                        'aggregated_rating': 1,
                        'summary': 1,
                        'screenshots': 1
                    }
                });
                requestMock.query.aggregate[3].should.be.eql({
                    $addFields: {
                        'mediaPs3Count': { $size: '$mediaPs3' },
                        'mediaPs4Count': { $size: '$mediaPs4' },
                        'mediaXbox360Count': { $size: '$mediaXbox360' },
                        'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                        'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                        'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                    }
                });
                requestMock.query.aggregate[4].should.be.eql({
                    $project: {
                        'mediaNintendo3ds': 0,
                        'mediaNintendoSwitch': 0,
                        'mediaPs3': 0,
                        'mediaPs4': 0,
                        'mediaXbox360': 0,
                        'mediaXboxOne': 0
                    }
                });
                requestMock.query.aggregate[5].should.be.eql({
                    $facet: {
                        'count': [{ $count: 'count' }],
                        'list': [{ $skip: 0 }, { '$limit': 10 }]
                    }
                });
                requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
                requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
            });

            it('múltiplas plataformas', async function () {
                let requestMock = {
                    'query': {
                        'mediaPlatform': 'PS4,PS3',
                        'page': 0,
                        'limit': 10
                    }
                };

                let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

                let nextObject = await brLibrary.searchHome(requestMock, responseMock, nextFunction = nextObject => nextObject);

                should(nextObject).not.be.ok();
                requestMock.query.should.have.property('endpoint', 'home');
                requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(8);
                requestMock.query.aggregate[0].should.be.eql({
                    $match: {
                        $or: [
                            { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                            { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                        ]
                    }
                });
                requestMock.query.aggregate[1].should.be.eql({ $sort: { 'createdAt': -1 } });
                requestMock.query.aggregate[2].should.be.eql({
                    $project: {
                        'mediaPs3': {
                            $filter: {
                                'input': '$mediaPs3', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaPs4': {
                            $filter: {
                                'input': '$mediaPs4', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXbox360': {
                            $filter: {
                                'input': '$mediaXbox360', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaXboxOne': {
                            $filter: {
                                'input': '$mediaXboxOne', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendo3ds': {
                            $filter: {
                                'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        'mediaNintendoSwitch': {
                            $filter: {
                                'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                                'cond': {
                                    $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                                }
                            }
                        },
                        '_id': 1,
                        'createdAt': 1,
                        'name': 1,
                        'aggregated_rating': 1,
                        'summary': 1,
                        'screenshots': 1
                    }
                });
                requestMock.query.aggregate[3].should.be.eql({
                    $addFields: {
                        'mediaPs3Count': { $size: '$mediaPs3' },
                        'mediaPs4Count': { $size: '$mediaPs4' },
                        'mediaXbox360Count': { $size: '$mediaXbox360' },
                        'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                        'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                        'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                    }
                });
                requestMock.query.aggregate[4].should.be.eql({
                    $project: {
                        'mediaNintendo3ds': 0,
                        'mediaNintendoSwitch': 0,
                        'mediaPs3': 0,
                        'mediaPs4': 0,
                        'mediaXbox360': 0,
                        'mediaXboxOne': 0
                    }
                });
                requestMock.query.aggregate[5].should.be.eql({
                    $facet: {
                        'count': [{ $count: 'count' }],
                        'list': [{ $skip: 0 }, { '$limit': 10 }]
                    }
                });
                requestMock.query.aggregate[6].should.be.eql({ $unwind: '$count' });
                requestMock.query.aggregate[7].should.be.eql({ $addFields: { 'count': '$count.count' } });
            });
        });
    });

    describe('## Detail', function () {

        it('dados ok', async function () {
            let requestMock = {
                'query': {},
                'params': { '_id': '3c3c3c3c3c3c4d4d4d4d4d4d' }
            };

            let responseMock = getResponseMock('1a2b3c4d5e6f1a2b3c4d5e6f');

            let nextObject = await brLibrary.detail(requestMock, responseMock, nextFunction = nextObject => nextObject);

            should(nextObject).not.be.ok();
            requestMock.query.should.have.property('endpoint', 'detail');
            requestMock.query.should.have.property('aggregate').which.is.an.Array().with.lengthOf(4);
            requestMock.query.aggregate[0].should.be.eql({
                $match: {
                    $or: [
                        { 'mediaPs3.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaPs4.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXbox360.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaXboxOne.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendo3ds.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' },
                        { 'mediaNintendoSwitch.ownerState': '1a2b3c4d5e6f1a2b3c4d5e6f' }
                    ],
                    '_id': '3c3c3c3c3c3c4d4d4d4d4d4d'
                }
            });
            requestMock.query.aggregate[1].should.be.eql({ $sort: { 'name': 1 } });
            requestMock.query.aggregate[2].should.be.eql({
                $project: {
                    'mediaPs3': {
                        $filter: {
                            'input': '$mediaPs3', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaPs4': {
                        $filter: {
                            'input': '$mediaPs4', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXbox360': {
                        $filter: {
                            'input': '$mediaXbox360', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaXboxOne': {
                        $filter: {
                            'input': '$mediaXboxOne', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendo3ds': {
                        $filter: {
                            'input': '$mediaNintendo3ds', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    'mediaNintendoSwitch': {
                        $filter: {
                            'input': '$mediaNintendoSwitch', 'as': 'singleMedia',
                            'cond': {
                                $eq: ['$$singleMedia.ownerState', '1a2b3c4d5e6f1a2b3c4d5e6f']
                            }
                        }
                    },
                    '_id': 1,
                    'createdAt': 1,
                    'name': 1,
                    'aggregated_rating': 1,
                    'summary': 1,
                    'screenshots': 1,
                    'id': 1,
                    'cover': 1,
                    'first_release_date': 1,
                    'game_modes': 1,
                    'updatedAt': 1,
                    'genres': 1,
                    'slug': 1,
                    'url': 1,
                    'videos': 1,
                    'formattedReleaseDate': 1
                }
            });
            requestMock.query.aggregate[3].should.be.eql({
                $addFields: {
                    'mediaPs3Count': { $size: '$mediaPs3' },
                    'mediaPs4Count': { $size: '$mediaPs4' },
                    'mediaXbox360Count': { $size: '$mediaXbox360' },
                    'mediaXboxOneCount': { $size: '$mediaXboxOne' },
                    'mediaNintendo3dsCount': { $size: '$mediaNintendo3ds' },
                    'mediaNintendoSwitchCount': { $size: '$mediaNintendoSwitch' }
                }
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

