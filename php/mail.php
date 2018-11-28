<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';

if (isset($_POST["send"])) {
    $mail = new PHPMailer(true);

    $to = $_POST['to'];
    $from = $_POST['from'];
    $subject = $_POST['subject'];
    $attachmentFilename = $_POST['attachmentFilename'];
    $attachmentContent = $_POST['attachmentContent'];
    $content = $_POST['content'];
    $redirect = str_replace("php/mail.php", "", "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");

    logToConsole($to);
    logToConsole($from);
    logToConsole($subject);
    logToConsole($content);
    logToConsole($redirect);

    try {
        $mail->setFrom($from);
        $mail->addAddress($to);
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = $content;

        if (isset($attachmentContent) && strlen($attachmentContent) > 0 && isset($attachmentFilename) && strlen($attachmentFilename) > 0) {
            logToConsole($attachmentFilename);
            $mail->addStringAttachment($attachmentContent, $attachmentFilename);
        }


        /*$headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $headers .= "From: $from";

        if (isset($to) && isset($subject) && isset($content) && isset($headers)) {
            mail($to, $subject, $content, $headers);
        }*/

        $mail->send();
        logToConsole('Email Sent');
        echo '<meta http-equiv="refresh" content="0; url=' .$redirect .'?success">';

    } catch (Exception $e) {
        echo "<script>console.log('Message could not be sent. Mailer Error:  " . $mail->ErrorInfo . "' ); </script>";
    }
}

function logToConsole($message) {
    echo "<script>console.log('" . $message . "' ); </script>";
}
?>