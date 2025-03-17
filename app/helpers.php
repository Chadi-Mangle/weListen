<?php

if (!function_exists('getRandomColor')) {
    function getRandomColor($seed) 
    {
        $colorPalette = [
            '#9d4edd', 
            '#4361ee', 
            '#f77f00', 
            '#2a9d8f', 
            '#e63946', 
            '#fb8500', 
            '#219ebc', 
            '#7209b7', 
            '#006d77', 
            '#ef476f', 
        ];

        return $colorPalette[$seed % count($colorPalette)];
    }
}