<?php

namespace App\Controller\Views;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app', name: 'app_')]
class RouteController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(): Response
    {
        return $this->render('views/index.html.twig');
    }

    #[Route('/user', name: 'user')]
    public function user(): Response
    {
        return $this->render('views/user.html.twig');
    }

    #[Route('/carte', name: 'carte')]
    public function carte(): Response
    {
        return $this->render('views/carte.html.twig');
    }

    #[Route('/login', name: 'login')]
    public function login(): Response
    {
        return $this->render('views/login.html.twig');
    }

    #[Route('/dashboard', name: 'dashboard')]
    public function dashboard(): Response
    {
        return $this->render('views/dashboard.html.twig');
    }
}