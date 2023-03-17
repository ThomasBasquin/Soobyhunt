<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class TestController extends AbstractController
{
    #[Route('/test', name: 'app_test')]
    public function publish(HubInterface $hub): Response
    {
        $update = new Update(
            'https://example.com/users/dunglas',
            json_encode(['status' => 'OutOfStock'])
        );

        $hub->publish($update);

        return $this->json('published!');
    }
}
