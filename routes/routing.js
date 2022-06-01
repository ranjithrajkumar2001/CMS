const connection = require("../database");
const express = require("express");
const app = express()
const multer = require("multer");
const { TIMESTAMP } = require("mysql/lib/protocol/constants/types");
const filestorage = multer.diskStorage({
    destination : (req, file,cb) =>{
        cb(null,'./files')
    },
    filename : (req, file, cb)=>{
        cb(null,Date.now()+"_"+file.originalname)
    }
})
const upload = multer({storage: filestorage})
const upload2 = multer({storage: filestorage}).array("file_name",3)
//Content Create
app.post('/content', upload.array('file_name',3), async function (req, res, next) {
        try{
                let user = req.body;
                let entries = Object.entries(user)
                let type = req.query.type;
                if (Object.keys(user).length === 0 ) 
                {
                    return res.status(400).send({ message: 'PLEASE PROVIDE REQUIRED DATA' });
                }
                let payload = []
                entries.forEach((item ,index) => {
                        payload[item[0]] = item [1]  
                });
                let values = Object.assign({},payload)
                let filename = ''
                let files = req.files;
                files.forEach(element=>{
                        filename = filename+element.originalname+','
                });
                connection.query("INSERT INTO "+type+" SET ?,file = ?",[values,filename],function(error,results,fields){
                if (error)
                {    
                    if (error.sqlMessage == "Duplicate entry '"+values["title"]+"' for key 'PRIMARY'")
                    {
                        return res.status(500).send({message: 'DUPLICATE ENTRY'})
                    }
                    else
                    {
                        //console.log(error)    
                        return res.status(500).send({message: 'PLEASE CHECK THE INPUT DATA'})
                    }
                }
                else
                {  
                    return res.status(201).send({message: 'Created'})
                }    
                })
            }
            catch (error)
            {
                return res.status(500)
            }
})
//content update by specific user
app.put('/updatecontent',function (req, res) {
    try
    {
            let user = req.query.user
            let title = req.query.title;
            connection.query('SELECT role_name FROM user where username=?',user, function (error, results, fields) {
                    if(results == '')
                    {
                            return res.status(403).send({message: 'PLEASE GIVE VALID DATA'});
                    }
                    else
                    {
                        results.forEach((item, index)=>{
                            if(item["role_name"] == "editor" || item["role_name"] == "Admin")
                            {
                                upload2(req,res,function(err) {  
                                    if(err) {  
                                        return res.status(500).send({message:"FILE UPLOAD UNSUCCESSFULL"}) 
                                    }  
                                    let filename = ''
                                    let files = req.files
                                    let data = req.body;
                                    let entries = Object.entries(data);
                                    let payload = []
                                    entries.forEach((item ,index) => {
                                    payload[item[0]] = item [1]  
                                    });
                                    let values = Object.assign({},payload)
                                    files.forEach(element=>{
                                    filename = filename+element.originalname+','
                                    connection.query("UPDATE content SET ?,file =?,Modified_date = CURRENT_TIMESTAMP where title =?",[values,filename,title],function (error, results, fields) {
                                        if (error)
                                        {
                                                console.log(error)
                                                return res.status(400).send({message: 'PLEASE PROVIDE REQUIRED DATA'})
                                        }
                                        return res.status(200).send({message: 'UPDATED SUCCESSFULLY'})
                                        });  
                                });
                                });      
                            }
                            else
                            {
                                connection.query('SELECT Created_by FROM content where title=?',title, function (error, results, fields) {
                                    
                                        let access = ''
                                        results.forEach((item,index)=>{
                                            access+=item["Created_by"]
                                        })
                                        if (access == user)
                                        {
                                            upload2(req,res,function(err) {  
                                                if(err) {  
                                                    return res.status(500).send({message:"FILE UPLOAD UNSUCCESSFULL"}) 
                                                }  
                                                let filename = ''
                                                let files = req.files
                                                let data = req.body;
                                                let entries = Object.entries(data);
                                                let payload = []
                                                entries.forEach((item ,index) => {
                                                payload[item[0]] = item [1]  
                                                });
                                                let values = Object.assign({},payload)
                                                files.forEach(element=>{
                                                filename = filename+element.originalname+','
                                                connection.query("UPDATE content SET ?,file =?,Modified_date = CURRENT_TIMESTAMP where title =?",[values,filename,title],function (error, results, fields) {
                                                    if (error)
                                                    {
                                                            console.log(error)
                                                            return res.status(400).send({message: 'PLEASE PROVIDE REQUIRED DATA'})
                                                    }
                                                    return res.status(200).send({message: 'UPDATED SUCCESSFULLY'})
                                                    });  
                                            });
                                            });  
                                        }
                                        else
                                        {
                                            return res.status(403).send({message:"YOU HAVE NO ACCESSS TO EDIT THIS CONTENT"})
                                        }
                                }) 
                            }
                                
                        })    
                    }
            });
            
    }
    catch(error)
    {
            console.log(error);
            return res.status(400).send({message: 'PLEASE ENTER VALID DETAILS'})
    }
    });

//Add user
app.post('/create',function(req,res){
    try{
        let user = req.body;
        //console.log(user)
        let entries = Object.entries(user)
        let type = req.query.type;
        if (Object.keys(user).length === 0  ) 
        {
            return res.status(400).send({ message: 'PLEASE PROVIDE REQUIRED DATA' });
        }
        let payload = []
        entries.forEach((item ,index) => {
                payload[item[0]] = item [1]  
        });
        let values = Object.assign({},payload)
        connection.query("INSERT INTO "+type+" SET ?",values,function(error,results,fields){
        if (error)
        {    
            if (error.sqlMessage == "Duplicate entry '"+values["role_name"]+"' for key 'PRIMARY'" || error.sqlMessage == "Duplicate entry '"+values["email_address"]+"' for key 'PRIMARY'" ||error.sqlMessage == "Duplicate entry '"+values["category_name"]+"' for key 'PRIMARY'")
            {
                return res.status(500).send({message: 'DUPLICATE ENTRY'})
            }
            else
            {
                //console.log(error)    
                return res.status(500).send({message: 'PLEASE CHECK THE INPUT DATA'})
            }
        }
        else
        {
            return res.status(201).send({message: 'Created'})
        }    
        })
    }
    catch (error)
    {
        return res.status(500)
    }
})

//Read
app.get('/read',function(req,res){
        try{
        let type = req.query.type;
        let order = req.query.order;
        connection.query("SELECT * FROM "+type+" ORDER BY "+order, function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
        });
        }
        catch(error)
        {
                return res.status(500)
        }
});

//Edit user
app.put('/update', function (req, res) {
    try
    {
            let type = req.query.type;
            let condition = req.query.condition;
            let data = req.body;
            let entries = Object.entries(data);
            let payload = []
            entries.forEach((item ,index) => {
            payload[item[0]] = item [1]  
            });
            let values = Object.assign({},payload)
            connection.query('SELECT * FROM '+type+' where'+condition+'=?',values[condition], function (error, results, fields) {
                    if(results == '')
                    {
                            return res.status(404).send({message: 'KEY NOT FOUND'});
                    }
                    else
                    {
                            connection.query("UPDATE "+type+" SET ? WHERE "+condition+"= '"+values[condition]+"'",values, function (error, results, fields) {
                            if (error)
                            {
                                    console.log(error)
                                    return res.status(400).send({message: 'PLEASE PROVIDE REQUIRED DATA'})
                            }
                            return res.status(200).send({message: 'UPDATED SUCCESSFULLY'})
                            });  
                    }
            });
            
    }
    catch(error)
    {
            console.log(error);
            return res.status(400).send({message: 'PLEASE ENTER VALID DETAILS'})
    }
    });

//Delete User
app.delete('/delete', function (req, res) {
    let condition = req.query.condition;
    let type = req.query.type;
    let data = req.body;
    let entries = Object.entries(data);
    let payload = []
    entries.forEach((item ,index) => {
    payload[item[0]] = item [1]  
    });
    let values = Object.assign({},payload)
    try 
    {
            connection.query('DELETE FROM '+type+' WHERE '+condition+ '= ?',values[condition], function (error, results, fields) {
                    if (error) throw error;
                    if(results.affectedRows == 0)
                    {
                            return res.status(404).send({message: 'GIVEN KEY NOT FOUND!!--ENTER VALID EMAIL ID'});
                    }
            return res.status(200).send({message: 'DELETED SUCCESSFULLY.' });
            });
    } catch (error) 
    {
           return res.status(400).send({message: 'ENTER VALID KEY'});
    }
   
    });
module.exports = app;