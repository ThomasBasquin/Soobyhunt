<?php

namespace App\Controller\Views;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ViewController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app', priority:"-1", defaults:["reactRouting" => null], requirements:["reactRouting" => ".+"])]
    public function index(): Response
    {
        return $this->render('view.html.twig');
    }
}