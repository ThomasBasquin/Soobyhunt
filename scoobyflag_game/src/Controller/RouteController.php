<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RouteController extends AbstractController
{
    #[Route('/', name: 'home', methods:["GET"])]
    public function home(): Response
    {
        return $this->render('Home.html.twig');
    }

    #[Route('/choiceTeam', name: 'choice_team', methods:["GET"])]
    public function choiceTeam(): Response
    {
        return $this->render('ChoiceTeam.html.twig');
    }

    #[Route('/game', name: 'game', methods:["GET"])]
    public function Game(): Response
    {
        return $this->render('Game.html.twig');
    }
}
