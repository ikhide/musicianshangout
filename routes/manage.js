const express = require('express');
const router = express.Router();

Instrument = require('../models/instrument');
Article = require('../models/article');

router.get('/articles', (req,res,next)=>{
    Article.getArticles((err, articles)=>{
        if (err){
            res.send(err);
        }
    
        res.render('manage_articles', {

            title: 'Manage Articles',
            articles: articles

        });
    });
});

router.get('/instruments', (req,res,next)=>{
    Instrument.getInstruments((err, instruments)=>{
        if (err){
            res.send(err);
        }
        res.render('manage_instruments', {
            title: 'Instruments',
            instruments: instruments
        });
    });
});

//add article

router.get('/articles/add', (req,res,next)=>{
    Instrument.getInstruments((err,instruments) =>{
        if (err){
            res.send(err)
        }

        res.render('add_article', {
            title: 'Create Article',
            instruments:instruments
        });
    });
});

//add instrument
router.get('/instruments/add', (req,res,next)=>{
    res.render('add_instrument', {

        title: 'Create Instrument'
    });
});

//Edit article page

router.get('/articles/edit/:id', (req,res,next)=>{
    Article.getArticleById(req.params.id,(err,article)=>{
        if (err) res.send(err);

        Instrument.getInstruments((err,instruments)=>{
            res.render('edit_article', {
            
                title: 'Edit Article',
                article: article,  
                instruments: instruments
            });
        });

        });
});

//Edit instrument page

router.get('/instruments/edit/:id', (req,res,next)=>{

    Instrument.getInstrumentById(req.params.id,(err,instrument)=>{
        if (err) res.send(err);

        res.render('edit_instrument', {
            
            title: 'Edit Instrument',
            instrument: instrument
        });
    });
});

module.exports = router;

  