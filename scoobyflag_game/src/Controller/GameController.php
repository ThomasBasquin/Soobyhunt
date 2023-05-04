<?php

namespace App\Controller;

use App\Entity\Game;
use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    private GameService $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }
    #[Route('/game/import', name: 'import_game', methods: ['POST'])]
    public function import(Request $request)
    {
        $data = $request->toArray();
        return $this->json($this->gameService->importGameSetting($data['gameTemplate']['json']), 200, [], ["groups" => ["Game:read", "Item:read", "Team:read", "Objective:read"]]);
    }

    #[Route('/game/{game}', name: 'get_game', methods: ['GET'])]
    public function get(Game $game)
    {
        return $this->json($game, 200, [], ['groups' => ["Game:read", 'Item:read', 'Team:read', 'Objective:read']]);
    }
    #[Route('/game/stat', name: 'get_game', methods: ['GET'])]
    public function stat()
    {
        return $this->json($this->gameService->stat());
    }
}
