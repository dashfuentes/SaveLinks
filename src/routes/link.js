const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add',(req,res) =>{
    res.render('links/add');
});

router.post('/add', async (req,res) =>{
    //  console.log(req.body);
    //destructuring
    const {title,url,description} = req.body;
    const newUrl = {
        title,
        url,
        description,
        user_id : 1
    };
    await pool.query('INSERT INTO links SET ?', [newUrl]);
    req.flash('success','Link saved successfully');
    res.redirect('/links');
});
//list
router.get('/', async(req,res) =>{
    const links = await pool.query('SELECT * FROM links');
    // console.log(links);
    res.render('links/list',{links});
});

//delete
router.get('/delete/:id',async(req,res) =>{
// console.log(req.params.id);
const {id} = req.params;
await pool.query('DELETE FROM links where id = ?', [id]);
req.flash('success','Link delete successfully');
res.redirect('/links');
});

//edit
router.get('/edit/:id',async(req,res) =>{  
    const {id} = req.params;
   const singleLink= await pool.query('SELECT * from links where id = ?',[id]);
    res.render('links/edit',{singleLink: singleLink[0]});
});

router.post('/edit/:id',async(req,res) =>{
    const {id} = req.params;
    const {title,url,description} =  req.body;
    const singleLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? where id = ?',[singleLink,id]);
    req.flash('success','Link update successfully');
    res.redirect('/links');
})

module.exports =  router;