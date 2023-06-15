<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use App\Service\GameService;
use App\Service\MercureService;
use App\Service\UserService;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    private GameService $gameService;
    private GameRepository $gameRepository;
    private UserService $userService;
    private HubInterface $hub;

    public function __construct(GameService $gameService, GameRepository $gameRepository, UserService $userService, HubInterface $hub)
    {
        $this->gameService = $gameService;
        $this->gameRepository = $gameRepository;
        $this->userService = $userService;
        $this->hub = $hub;
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
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);
        dump(
            $this->gameService->stat(),
            $this->gameService->formatData()
        );
        return $this->json($this->gameService->stat());
    }

    #[Route('/game/info', name: 'get-info', methods: ['GET'])]
    public function info(GameService $gameService)
    {
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);
        return $this->json(["teams" => $this->gameService->stat(), "game" => $game], 200, [], ["groups" => ["Info:read"]]);
    }

    #[Route('/game/start', name: 'game_start', methods: ['PUT'])]
    public function start()
    {

        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);
        $game->setStartAt(new DateTimeImmutable());

        $this->gameService->save($game);

        // $minutes = '+ '. $game->getLimitTime().' minutes';
        // $endAt = new DateTime();
        // $endAt->modify($minutes);

        $process = new Process(['php', 'bin/console', 'game-end-at']);
        $process->start();

        foreach ($this->userService->findAll() as $user) {
            $update = new Update(
                "https://scoobyflag/user/" . $user->getId(),
                json_encode(["start" => true])
            );
            $this->hub->publish($update);
        }

        $update = new Update(
            "https://scoobyflag/user/0",
            json_encode(["start" => true])
        );
        $this->hub->publish($update);

        return $this->json($game, 200, [], ['groups' => ['Game:read']]);
    }

    #[Route('/game/end', name: 'game_end', methods: ['PUT'])]
    public function end()
    {
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);

        $data = $this->gameService->formatData();

        $dotenv = new Dotenv();
        $dotenv->load(__DIR__ . '/../../.env');
        $projectName = $_ENV['PROJECT_NAME'];

        $id = $_ENV['ID'];
        $url = 'https://scoobyhunt.fr/game/' . $id . '/end';
        // $url = 'https://127.0.0.1:8000/game/end/10';
        // $url = 'https://127.0.0.1:8000/game/' . $id . '/end';

        try {
            $client = HttpClient::create();
            $response = $client->request(
                'PUT',
                $url,
                [
                    'headers' => [
                        'accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ],
                    'body' => json_encode(['projectName' => $projectName, 'data' => $data]),
                ]
            );

            // Process the response as needed

            return $this->json(['projectname' => $projectName, 'data' => $data], 200, [], ['groups' => ["Game:info", 'Item:read', 'Team:get', 'User:info']]);
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
