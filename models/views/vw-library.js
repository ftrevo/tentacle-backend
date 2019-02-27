// ------------------- Objetos Exportadas ------------------- //
const createVwObject = {
    viewOn: 'games',
    pipeline: [
        { $sort: { 'createdAt': -1 } },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'PS3'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaPs3'
            }
        },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'PS4'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaPs4'
            }
        },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'XBOX360'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaXbox360'
            }
        },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'XBOXONE'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaXboxOne'
            }
        },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'NINTENDO3DS'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaNintendo3ds'
            }
        },
        {
            $lookup: {
                from: 'media',
                let: { game_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$platform', 'NINTENDOSWITCH'] },
                                    { $eq: ['$active', true] },
                                    { $eq: ['$game', '$$game_id'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1, owner: 1 } },
                    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                    { $unwind: '$ownerData' },
                    {
                        $addFields: {
                            'ownerName': '$ownerData.name',
                            'ownerState': '$ownerData.state',
                            'ownerCity': '$ownerData.city'
                        }
                    },
                    { $project: { 'ownerData': 0 } }
                ],
                as: 'mediaNintendoSwitch'
            }
        },
        {
            $match: {
                $or: [
                    { 'mediaPs3': { $exists: true, $ne: [] } },
                    { 'mediaPs4': { $exists: true, $ne: [] } },
                    { 'mediaXbox360': { $exists: true, $ne: [] } },
                    { 'mediaXboxOne': { $exists: true, $ne: [] } },
                    { 'mediaNintendo3ds': { $exists: true, $ne: [] } },
                    { 'mediaNintendoSwitch': { $exists: true, $ne: [] } }
                ]
            }
        },
        {
            $addFields: {
                'mediaPs3Count': {
                    $size: '$mediaPs3'
                },
                'mediaPs4Count': {
                    $size: '$mediaPs4'
                },
                'mediaXbox360Count': {
                    $size: '$mediaXbox360'
                },
                'mediaXboxOneCount': {
                    $size: '$mediaXboxOne'
                },
                'mediaNintendo3dsCount': {
                    $size: '$mediaNintendo3ds'
                },
                'mediaNintendoSwitchCount': {
                    $size: '$mediaNintendoSwitch'
                }
            }
        }
    ]
};

// --------------------- Module Exports --------------------- //
module.exports = createVwObject;
