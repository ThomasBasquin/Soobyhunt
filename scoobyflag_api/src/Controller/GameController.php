<?php

namespace App\Controller;

use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

#[Route('/game', name: 'game_')]
class GameController extends AbstractController
{

    private GameService $gameService;
    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    #[Route('/create/template', name: 'create_template', methods: 'POST')]
    public function create(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $this->gameService->createTemplate($data);
        dump($data);
        return $this->json(json_encode($data));
    }

    #[Route('/create', name: 'create', methods: 'POST')]
    public function createGame(Request $request)
    {
        $options = json_decode($request->getContent(), true);
        $process = new Process([ 'docker' , 'run' , 'totomadne/game-server' ]);
        $process->run();

        // executes after the command finishes
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
        
        echo $process->getOutput();
        return $this->json(json_encode($options));
    }
}
