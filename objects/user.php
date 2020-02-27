<?php
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "users";
 
    // object properties
    public $uuid;
    public $username;
    public $fname;
    public $lname;
    public $phone;
    public $permissionLevel;
    public $created;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
    
    // read products
    function read(){
    
        // select all query
        $query = "SELECT
                    p.level as permissionLevel, u.uuid, u.username, u.fname, u.lname, u.phone, u.created
                FROM
                    " . $this->table_name . " u
                    LEFT JOIN
                        permissions p
                            ON u.uuid = p.uuid
                ORDER BY
                    u.created DESC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }
}

?>