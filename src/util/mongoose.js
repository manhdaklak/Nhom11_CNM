module.exports ={

    mutilpleMongoose: function(mongooses){
        return mongooses.map(mongooses=>mongooses.toObject());
    },
    mongooseToObject: function(mongooses){
        return mongooses ? mongooses.toObject():mongooses;
    }
};