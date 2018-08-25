const express = require('express');
const router = express.Router();


router.get('/', ensureAuthenticated,(req,res,next)=>{
        Article.getArticles((err,articles)=>{
            res.render('articles',{
            title: 'Articles',
            articles,articles
            
            });
        });

    });

    //single article
router.get('/show/:id', (req,res,next)=>{
    Article.getArticleById(req.params.id,(err,article)=>{
        if (err) res.send(err);

            res.render('article', {
            
                title: 'Article',
                article: article,  
                        
        });

        });

});

router.get('/instrument/:instrument_id', (req,res,next)=>{

    Article.getInstrumentArticles(req.params.instrument_id,(err, articles)=>{
        Instrument.getInstrumentById(req.params.instrument_id,(err,instrument)=>{

        
        res.render('articles',{
            title: instrument.title+ ' Articles',
            articles: articles
        });
    });
});
});


//Add article
router.post('/add', (req,res,next) =>{

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();


    let errors = req.validationErrors();

    if (errors){
        Instrument.getInstruments((err,instruments) =>{
        if (err){
            res.send(err)
        }

            res.render('add_article', {
                errors : errors,
                title: 'Create Article',
                instruments:instruments
            });
        });




        
    } 
    else {
        let article = new Article();
        article.title = req.body.title;
        article.subtitle = req.body.subtitle;
        article.instrument = req.body.instrument;
        article.body = req.body.body;
        article.author = req.body.author;


        Article.addArticle(article,(err,article)=>{
            if (err) res.send(err);
            req.flash('success', 'Article Added');
            res.redirect('/manage/articles');
        });
    }
 });

//Edit Article
router.post('/edit/:id', (req,res,next) =>{  

req.checkBody('title', 'Title is required').notEmpty();
req.checkBody('author', 'Author is required').notEmpty();
req.checkBody('body', 'Body is required').notEmpty();


let errors = req.validationErrors();

if (errors){
    Article.getArticleById(req.params.id,(err,article)=>{
        if (err) res.send(err);

        Instrument.getInstrument((err,instruments)=>{
            res.render('edit_article', {
            
                title: 'Edit Article',
                errors: errors,
                article: article,  
                instruments: instruments
            });
        });

    });

} 
else {
    let article = new Article();
    const query = {_id: req.params.id}

    const update = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        instrument: req.body.instrument,
        author: req.body.author,
        body: req.body.body
    }


    Article.updateArticle(query, update, {}, (err,article)=>{
        if (err) res.send(err);
        req.flash('success', 'Article Updated');
        res.redirect('/manage/articles');

    });
}

});

//delete article
router.delete('/delete/:id', (req,res,next)=>{;
    const query = {_id:req.params.id}
 
    Article.removeArticle(query,(err,article)=>{
        if (err) res.send(err);
        else{
            res.send('ok')
        }
    });
});



//store comments
 router.post('/comments/add/:id' , (req,res,next)=>{

     req.checkBody('comment_subject', 'Subject is required').notEmpty();
     req.checkBody('comment_author', 'Author is required').notEmpty();
     req.checkBody('comment_body', 'Body is required').notEmpty();

     let errors = req.validationErrors();

     if(errors){
         Article.getArticleById(req.params.id,(err,article)=>{
             if (err) res.send(err);
    
                 res.render('article', {
                    
                     errors: errors,
                     title: 'Article',
                     article: article,  
                
            });
    
        });

     } else{
         let article = new Article()
         let query ={_id: req.params.id}

         let comment = {
              comment_subject : req.body.comment_subject,
              comment_author: req.body.comment_author,
              comment_body: req.body.comment_body,
              comment_email: req.body.comment_email
        }

        Article.addComment(query,comment,(err,article)=>{
            if (err) res.send(err);

             res.redirect('/article/show/'+req.params.id)
         });
     };

 });

 //Access control
 function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return next();
    } else{
      req.flash('error', 'You are not Logged in!')
      res.redirect('/login');
    }
  }


 module.exports = router;

