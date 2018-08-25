const mongoose = require('mongoose');

// instrument schema
const instrumentSchema = mongoose.Schema({
    title:{
        type: String
    },
    description:{
        type: String
    }
});


const Instrument = module.exports= mongoose.model('Instrument', instrumentSchema);



//get instruments

module.exports.getInstruments = (callback, limit)=>{
    Instrument.find(callback).limit(limit).sort([['title', 'ascending']]);
};

//add instrument

module.exports.addInstrument= (instrument,callback)=>{
    Instrument.create(instrument, callback);
};

//Get Single instrument

module.exports.getInstrumentById = (id,callback)=>{
    Instrument.findById(id, callback);
};

// Update instruments

module.exports.updateInstrument = (query, update, options, callback)=>{
    Instrument.findOneAndUpdate(query,update,options,callback);
};

//remove instrument
module.exports.removeInstrument = (query, callback)=>{
    Instrument.remove(query,callback);
};




 


