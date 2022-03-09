<?php 
session_start();
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="shortcut icon" href="#">

    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        .game-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>

    <link rel="stylesheet" href="css/app.css">
</head>
<body>
    
    <div class="game-container"></div>

    <!-- Game Components -->
    <script src="js/components/gIcon.js"></script>
    <script src="js/components/gHelper.js"></script>
    <script src="js/components/gApp.js"></script>
    <script src="js/components/gUI.js"></script>
    <script src="js/components/gCards.js"></script>
    <script src="js/components/game.js"></script>
    <!-- Game Components -->

    <!-- Compiled Game Script --
    <script src="js/app.js"></script>
    <!-- Compiled Game Script -->

    <script>

        // Database
        gApp.processUrl = 'process.php';
        game.token = "<?php echo (isset($_SESSION['token']) ? $_SESSION['token'] : ''); ?>";

        // Game Initialization
        game.Init('.game-container');

    </script>

</body>
</html>