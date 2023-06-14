<?php
// src/Twig/AppExtension.php
namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction('getIp', [$this, 'getIp']),
        ];
    }

    public function getIp()
    {
        return gethostbyname(gethostname());
    }
}