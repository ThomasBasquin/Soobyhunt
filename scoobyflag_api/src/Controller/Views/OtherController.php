<?php

namespace App\Controller\Views;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OtherController extends AbstractController
{
    #[Route('/', name: 'index', priority:"-1")]
    public function other(): Response
    {
        return $this->redirectToRoute("app_index");
    }
}