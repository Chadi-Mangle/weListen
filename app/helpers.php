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

if (!function_exists('getRandomImage')) {
    function getRandomImage($seed) 
    {
        $imagePalette = [
            'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=1972&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558258021-971dd2148be5?q=80&w=2070&auto=format&fit=crop',
            'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg',
            'https://images.pexels.com/photos/442540/pexels-photo-442540.jpeg',
            'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg',
            'https://images.unsplash.com/photo-1531463368359-151247409561',
            'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576967402682-19976eb930f2',
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
            'https://images.unsplash.com/photo-1575925251153-6953908bc215', 
        ];

        return $imagePalette[$seed % count($imagePalette)];
    }
}