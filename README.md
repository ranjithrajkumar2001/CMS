# CMS
Content Management System


PACKAGES TO INSTALL:

    1)EXPRESS JS
    2)MULTER
    3)MYSQL
    4)BODY-PARSER
    
    npm install <package name>
    
Modules

    1)Content
    2)Role
    3)Category
    4)User

Collection json file

GET

    Read all the records of every modules wiht this api
    type  - table name
    order - field name(It gives the record in ascending order based on the field name)
    
POST

    Create new record to Role,Category,User with this api
    type - table name
 
PUT

    Update all the records in Role,Category and User modules
    type      - table name
    condition - field name (Primary key)

DELETE

    Delete records of all the modules with this api
    type      - table name
    condition - field name (Primary key)
    
CONTENT CREATION

    Create new content using this api
    type - table name
    
UPDATE CONTENT
  
    Update records in the content table
    
#Behaviour

    Admin can create categories and contents. These categories and content can be viewed by all users.
    Users has access to create, update, and delete their own content
    Users can upload multiple files
    User can map their own content to multiple categories
    Users have category based access to list and view the content

