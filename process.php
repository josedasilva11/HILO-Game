<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
if (isset($_SESSION['token'])) {
    if (isset($data["token"]) && $data["token"] == $_SESSION["token"]) {

        // Connect to database
        $mysqli = new mysqli(
            "localhost",
            "root",
            "",
            "hilo"
        );

        // If connection successful
        if ($mysqli -> connect_errno) {
            echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
            exit();
        } else {

            // Get posted JSON
            $name = $mysqli -> real_escape_string($data["name"]);
            $wallet = $mysqli -> real_escape_string($data["wallet"]);
            $wins = $mysqli -> real_escape_string($data["wins"]);
            $money = $mysqli -> real_escape_string($data["money"]);

            // Update?
            $query = mysqli_query($mysqli, "SELECT * FROM leaderboard WHERE wallet='".$wallet."'");
            if(mysqli_num_rows($query) > 0) {

                $sql = "UPDATE leaderboard SET wins='$wins',money='$money' WHERE wallet='$wallet'";

                if ($mysqli->query($sql) === TRUE) {
                echo "Record updated successfully";
                } else {
                echo "Error updating record: " . $mysqli->error;
                }

            } else {

                // Insert
                $sql = "INSERT INTO leaderboard (name,wallet,wins,money)
                VALUES ('$name','$wallet','$wins','$money')";

                if ($mysqli->query($sql) === TRUE) {
                    echo "New record created successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $mysqli->error;
                }

            }

        }

        die();

    }
} else {
    $_SESSION['token'] = md5(uniqid(mt_rand(), true));
}

?>