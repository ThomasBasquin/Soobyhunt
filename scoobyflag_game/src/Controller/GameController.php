<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpClient\HttpClient;
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

    #[Route('/game/end', name: 'game_end', methods: ['PUT'])]
    public function end()
    {
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);


        $data = $this->gameService->formatData();
        // stop game
        $dotenv = new Dotenv();
        $dotenv->load(__DIR__ . '/../../.env');
        $projectName = $_ENV['PROJECT_NAME'];
        
        $id = $_ENV['ID'];
        // $url = 'https://scoobyhunt.fr/game/' . $id . '/end';
        $url = 'https://127.0.0.1:8000/game/end/10';
        // $url = 'https://127.0.0.1:8000/game/' . $id . '/end';
        dump($url, $data);

        try {
            $client = HttpClient::create();
            $response = $client->request(
                'PUT',
                $url,
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                    ],
                    'body' => json_encode(['projectName' => $projectName, 'data'=> $data]),
                ]
            );
    
            // Process the response as needed
    
            return $this->json(['projectname' => $projectName, 'game' => $game], 200, [], ['groups' => ["Game:info", 'Item:read', 'Team:get', 'Objective:read', 'User:info']]);
        } catch (\Throwable $e) {
            // Handle the exception
            // You can log the error, display a specific error message, or perform any necessary error handling logic
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/game/{game}', name: 'get_game', methods: ['GET'])]
    public function get(Game $game)
    {
        return $this->json($game, 200, [], ['groups' => ["Game:read", 'Item:read', 'Team:get', 'Objective:read']]);
    }
}
