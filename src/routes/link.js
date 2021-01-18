const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add',(req,res) =>{
    res.render('links/add');
});

router.post('/add', async (req,res) =>{
    //  console.log(req.body);
    //destructurin
    const {title,url,description} = req.body;
    const newUrl = {
        title,
        url,
        description,
        user_id : 1
    };
    await pool.query('INSERT INTO links SET ?', [newUrl]);
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
res.redirect('/links');
});

module.exports =  router;