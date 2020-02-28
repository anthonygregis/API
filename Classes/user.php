<?php
class User{

    // Connection instance
    private $connection;

    // table name
    private $table_name = "users";

    // table columns
    public $id;
    public $UUID;
    public $username;
    public $fname;
    public $lname;
    public $phone;
    public $password;
    public $passphrase;
    public $user_level;
    public $created_at;

    public function __construct($connection){
        $this->connection = $connection;
    }

    //C
    public function create(){
    }
    //R
    public function read(){
        $query = "SELECT c.UUID as UUID, p.id, p.UUID, p.username, p.fname, p.lname, p.phone, p.password, p.user_level, p.created_at FROM" . $this->table_name . " p ORDER BY p.created_at DESC";

        $stmt = $this->connection->prepare($query);

        $stmt->execute();

        return $stmt;
    }
    //U
    public function update(){}
    //D
    public function delete(){}
}