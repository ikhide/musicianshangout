const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated,(req,res,next)=>{
    Instrument.getInstruments((err, instruments)=>{
        if (err){
            res.send(err);
        }


        res.render('instruments', {
            title: 'Instruments',
            instruments: instruments
        });
    });
    
});

//add instrument
router.post('/add', (req,res,next)=>{
    req.checkBody('title', 'Title is required').notEmpty();

    let errors = req.validationErrors();

    if (errors){
        res.render('add_instrument',{
            errors : errors,
            title: 'Create Instrument'
        })
    } else{

        let instrument = new Instrument();
        instrument.title = req.body.title;
        instrument.description = req.body.description;

        Instrument.addInstrument(instrument,(err,instrument)=>{
        if (err) res.send(err);

        req.flash('success', 'Instrument Saved');
        res.redirect('/manage/instruments');
    });
    }
});

//edit instrument

router.post('/edit/:id', (req,res,next)=>{
    req.checkBody('title', 'Title is required').notEmpty();

    let errors = req.validationErrors();

    if (errors){
        Instrument.getInstrumentById(req.params.id,(err,instrument)=>{
            if (err) res.send(err);
    
            res.render('edit_instrument', {
                errors : errors,
                title: 'Edit Instrument',
                instrument: instrument
            });
        });
        
    } else{
   
    const query = {_id:req.params.id}
    const update = {title: req.body.title, description: req.body.description}


    Instrument.updateInstrument(query,update, {},(err,instrument)=>{
        if (err) res.send(err);

        req.flash('success', 'Instrument Updated');
        res.redirect('/manage/instruments');
    
    });
}
});

//delete instrument
router.delete('/delete/:id', (req,res,next)=>{;
    const query = {_id:req.params.id}
 
    Instrument.removeInstrument(query,(err,instrument)=>{
        if (err) res.send(err);
        else{
            res.send('ok')
        }
    });
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

