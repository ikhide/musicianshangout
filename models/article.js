const mongoose = require('mongoose');

// article schema

const articleSchema = mongoose.Schema({
    title:{
        type: String
    },
    subtitle:{
        type: String
    },
    instrument:{
        type: String
    },
    body:{
        type: String
    },
    author:{
        type: String
    },
    created_at:{
        type: Date,
        default:Date.now
    },
    comments:[{
        comment_subject:{
            type: String
        },
        comment_body:{
            type: String
        },
        comment_author:{
            type: String
        },
        comment_email:{
            type: String
        },
        comment_date:{
            type: String
        }
    }]
});


const Article = module.exports= mongoose.model('Article', articleSchema);

//get Articles
module.exports.getArticles = (callback, limit)=>{
    Article.find(callback).limit(limit).sort([['title', 'ascending']]);
};

//get article by instrument
module.exports.getInstrumentArticles = (instrumentId, callback) =>{
    let query = {instrument: instrumentId}
    Article.find(query, callback).sort([['title', 'ascending']]);
}

//add article
module.exports.addArticle= (article,callback)=>{
    Article.create(article, callback);
};

//Get Single article
module.exports.getArticleById = (id,callback)=>{
    Article.findById(id, callback);
};

// Update article
module.exports.updateArticle = (query, update, options, callback)=>{
    Article.findOneAndUpdate(query,update,options,callback);
};

//remove article
module.exports.removeArticle = (query, callback)=>{
    Article.remove(query,callback);
};

module.exports.addComment = (query,comment, callback)=>{
    Article.update(query,
    {
        $push:{
            comments: comment
        }
    },
    callback
    );
}


