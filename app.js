var express             = require('express');
var mongoose            = require('mongoose');
var methodOverride      = require('method-override');
var bodyParser          = require('body-parser');
var expressSanitizer    = require('express-sanitizer');
var app                 = express();
//APP CONFIG
mongoose.connect('mongodb://localhost/restblog', { useNewUrlParser: true });
mongoose.set('useFindandModify', false);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//setting up the schema
var blogSchema = new mongoose.Schema({
    title: String,
    url: String,
    post: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', blogSchema);



//RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
//SHOW Route [Display]
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, result) => {
        if (err) { throw err; } else {
            res.render('index.ejs', { blogs: result });
        }
    });
});
//NEW Route[Display]
app.get('/blogs/new', (req, res) => {
    res.render('new.ejs');
});
//Create Route[Create]
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let data = req.body.blog;
    Blog.create(data, (err, result) => {
        if (err) {
            res.send('Whoops');
        } else {
            res.redirect('/blogs');
        }
    });
});
//Show Route[Display]
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id,(err,results)=>{
        if(err){
            throw err
            res.send('404 NOT FOUND');
        }else{
            res.render('show.ejs', {blog: results});
        }
    });
});
//Edit Route[Display] 
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,cb)=>{
        if(err){
            throw err
        }else{
            res.render('edit.ejs',{blog:cb});
        }
    });
});
//Update Route[Update]
app.put('/blogs/:id',(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,cb)=>{
        if(err){
            res.send('Cannot Update blog');
        }else{
            res.redirect('/blogs/'+ req.params.id);
        }
    });
});
//Delete Route[Destroy]
app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err,cb)=>{
        if(err){
            res.send('Cannot Delete Blog');
        }else{
            res.redirect('/blogs');
        }
    });
});



var server = app.listen(3000, () => {
    console.log('Blog server is running');
});