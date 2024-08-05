<?php

declare(strict_types=1);

$file     = __DIR__ . '/chat.json';
$contents = json_decode(file_get_contents($file));

$wordCountItems     = [];
$totalMessageSent   = $totalMessageReceived = 0;
$countSentChars     = [];
$countReceivedChars = [];

$ignoredChars = ['.', '!', '?', '(', ')', ','];
foreach ($contents as $chat) {
    $totalChars = strlen($chat->content);
    if ($chat->senderId === 'user') {
        $totalMessageSent++;
        $countSentChars[] = $totalChars;
    } else {
        $totalMessageReceived++;
        $countReceivedChars[] = $totalChars;
    }

    $normalizedContent = str_replace($ignoredChars, ' ', strtolower($chat->content));
    $exploded          = explode(' ', $normalizedContent);
    foreach ($exploded as $item) {
        if ($item === '') {
            continue;
        }

        if (! isset($wordCountItems[$item])) {
            $wordCountItems[$item] = 0;
        }

        $wordCountItems[$item]++;
    }
}

arsort($wordCountItems);

$topWords = array_slice($wordCountItems, 0, 5);

$averageCharSent     = round(array_sum($countSentChars) / count($countSentChars));
$averageCharReceived = round(array_sum($countReceivedChars) / count($countReceivedChars));


echo <<<'HTML'
<ul>
    <li>Top 5 sent words:
        <ul>
HTML;
foreach ($topWords as $word => $total) {
    echo <<<HTML
        <li>{$word} ({$total}x)</li>
    HTML;
}

echo <<<HTML
        </ul>
    </li>
    <li>Total messages sent: {$totalMessageSent}</li>
    <li>Total messages received: {$totalMessageReceived}</li>
    <li>Average character length sent: {$averageCharSent}</li>
    <li>Average character length received: {$averageCharReceived}</li>
</ul>
HTML;
