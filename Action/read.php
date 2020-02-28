header("Content-Type: application/json; charset=UTF-8");

include_once '../Database/connection.php';
include_once '../Classes/user.php';

$dbclass = new DBClass();
$connection = $dbclass->getConnection();

$user = new User($connection);

$stmt = $user->read();
$count = $stmt->rowCount();

if($count > 0){


    $users = array();
    $users["body"] = array();
    $users["count"] = $count;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        extract($row);

        $p  = array(
              "id" => $id,
              "UUID" => $UUID,
              "username" => $username,
              "fname" => $fname,
              "lname" => $lname,
              "phone" => $phone,
              "password" => $password,
              "passphrase" => $passphrase,
              "user_level" => $user_level,
              "created_at" => $created_at
        );

        array_push($users["body"], $p);
    }

    echo json_encode($users);
}

else {

    echo json_encode(
        array("body" => array(), "count" => 0);
    );
}
?>