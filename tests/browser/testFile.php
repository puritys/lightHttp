<?php

print_r($_FILES);
print_r($_POST);
echo "content = " . file_get_contents($_FILES['fileData']['tmp_name']);
