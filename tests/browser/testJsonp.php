<?php
$time = time() . '-' . rand(1000, 9999);
echo $_GET['callback'].'("response ' . $time. '");';
