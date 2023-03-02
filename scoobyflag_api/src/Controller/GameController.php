<?php

namespace App\Controller;

use App\Entity\GameTemplate;
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
    #[Route('/create', name: 'create', methods: 'POST')]
    public function createGame(Request $request)
    {
        $response = new JsonResponse();
        $response->headers->set('Access-Control-Allow-Origin', '*');

        // Générer un port aléatoire
        $port = rand(1024, 65535);
        $gameServerPort = 1650;

        // Exécuter la commande Docker avec le port aléatoire
        $process = new Process(['docker', 'run', '-p', "$port:$gameServerPort", 'totomadne/game-server']);
        $process->run();

        // Récupérer l'adresse IP du serveur
        $containerId = trim($process->getOutput());
        $ipAddress = exec("docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $containerId");

        // Retourner l'adresse IP et le port attribué
        return $this->json([
            'ip' => $ipAddress,
            'port' => $port
        ]);
    }


    #[Route('/{gameTemplate}', name: 'get_template', methods: 'GET')]
    public function get(GameTemplate $gameTemplate)
    {
        return $this->json(['gameTemplate' => $gameTemplate], 200, [], ["groups" => ["GameTemplate:read", "Item:read", "Objective:read", "GameZone:read", "Team:read"]]);
    }

    #[Route('/create/template', name: 'create_template', methods: 'POST')]
    public function create(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $gameTemplate = $this->gameService->createTemplate($data);
        return $this->json(['gameTemplate' => $gameTemplate], 200, [], ["groups" => ["GameTemplate:read", "Item:read", "Objective:read", "GameZone:read", "Team:read"]]);
    }
}
