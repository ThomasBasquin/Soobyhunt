<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GameController extends AbstractController
{
    private GameService $gameService;
    private GameRepository $gameRepository;

    public function __construct(GameService $gameService, GameRepository $gameRepository)
    {
        $this->gameService = $gameService;
        $this->gameRepository = $gameRepository;
    }

    #[Route('/game/import', name: 'import_game', methods: ['POST'])]
    public function import(Request $request)
    {
        $data = $request->toArray();
        return $this->json($this->gameService->importGameSetting($data['gameTemplate']['json']), 200, [], ["groups" => ["Game:read", "Item:read", "Team:read", "Objective:read"]]);
    }
    #[Route('/game/stat', name: 'get_stat', methods: ['GET'])]
    public function stat()
    {
        return $this->json($this->gameService->stat());
    }

    #[Route('/game/info', name: 'get-info', methods: ['GET'])]
    public function info(GameService $gameService)
    {
        $game = $gameService->find(1);
        return $this->json(["teams" => $this->gameService->stat(), "game" => $game], 200, [], ["groups" => ["Info:read"]]);
    }
    #[Route('/game/end', name: 'game_end', methods: ['GET'])]
    public function end()
    {
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);;
        dump($game);
        foreach ($game->getTeams() as $team) {
            # code...
            dump($team);

        }
        return $this->json( $game, 200, [], ['groups' => ["Game:info", 'Item:read', 'Team:get', 'Objective:read', 'User:info']]);
    }

    #[Route('/game/{game}', name: 'get_game', methods: ['GET'])]
    public function get(Game $game)
    {
        return $this->json($game, 200, [], ['groups' => ["Game:read", 'Item:read', 'Team:get', 'Objective:read']]);
    }
}
