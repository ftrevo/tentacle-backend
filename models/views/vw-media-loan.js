// ------------------- Objetos Exportadas ------------------- //
const createVwObject = {
    viewOn: 'media',
    pipeline: [
        {
            $lookup: {
                from: 'loans',
                let: { 'media_id': '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$media', '$$media_id'] },
                                    { $not: { $gt: ['$returnDate', null] } }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'requestedAt': 1,
                            'loanDate': 1,
                            'estimatedReturnDate': 1,
                            'requestedBy': 1,
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: {
                                'requestedBy_id': '$requestedBy'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$_id', '$$requestedBy_id'] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'requestedByData'
                        }
                    },
                    { $unwind: { path: '$requestedByData', preserveNullAndEmptyArrays: true } },
                    {
                        $addFields: {
                            'requestedByName': '$requestedByData.name',
                            'requestedByState': '$requestedByData.state',
                            'requestedByCity': '$requestedByData.city'
                        }
                    },
                    { $project: { 'requestedByData': 0 } }
                ],
                as: 'activeLoan'
            }
        },
        { $unwind: { path: '$activeLoan', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'games',
                let: { 'game_id': '$game' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$_id', '$$game_id']
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'id': 1,
                            'name': 1,
                            'cover': 1,
                            'aggregated_rating': 1,
                            'formattedReleaseDate': 1,
                            'first_release_date': 1,
                            'game_modes': 1,
                            'genres': 1,
                            'summary': 1
                        }
                    }
                ],
                as: 'gameData'
            }
        },
        { $unwind: { path: '$gameData', preserveNullAndEmptyArrays: true } },
        { $sort: { 'gameData.name': 1 } },
    ]
};

// --------------------- Module Exports --------------------- //
module.exports = createVwObject;
