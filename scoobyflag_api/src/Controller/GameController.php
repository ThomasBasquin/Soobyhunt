<?php

namespace App\Controller;

use App\Entity\Game;
use App\Entity\GameTemplate;
use App\Repository\GameRepository;
use App\Repository\GameTemplateRepository;
use App\Service\GameService;
use DateTime;
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
    private GameTemplateRepository $gameTemplateRepository;
    private GameRepository $gameRepository;
    public function __construct(GameService $gameService,GameTemplateRepository $gameTemplateRepository,GameRepository $gameRepository)
    {
        $this->gameService = $gameService;
        $this->gameTemplateRepository = $gameTemplateRepository;
        $this->gameRepository = $gameRepository;
    }
    #[Route('/create', name: 'create', methods: 'POST')]
    public function createGame(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        
        if (!!$this->gameTemplateRepository->find($data['idTemplate'])) {
            $game = new Game();
            $game->setGameTemplate($this->gameTemplateRepository->find($data['idTemplate']));
            $game->setStartAt(new DateTime());
            $this->gameService->save($game);
            return $this->json($game, 201,[],['groups'=>['Game:read','GameTemplate:read' ]]);
        }
        return $this->json('Template existe pas mamen');
       
    }
    #[Route('/{game}', name: 'get', methods: 'get')]
    public function getGame(Game $game)
    {
        dump($game,
        $this->gameRepository->find(12));
        $this->gameRepository->find(5);
        return $this->json($game->getGameTemplate(), 201,[],['groups'=>['Game:read','GameTemplate:read' ]]);
       
    }


    #[Route('/gameTemplate/{gameTemplate}', name: 'get_template', methods: 'GET')]
    public function getTemplate(GameTemplate $gameTemplate)
    {
        return $this->json(['gameTemplate' => $gameTemplate], 200, [],['groups'=> ['GameTemplate:read', 'User:read']]);
    }

    #[Route('/create/template', name: 'create_template', methods: 'POST')]
    public function create(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $gameTemplate = $this->gameService->createTemplate($data);
        return $this->json(['gameTemplate' => $gameTemplate], 201,[],['groups'=>['GameTemplate:read', 'User:read']]);
    }
    
    #[Route('/modify/template/{gameTemplate}', name: 'modify_template', methods: 'PUT')]
    public function modify(GameTemplate $gameTemplate ,  Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $gameTemplate->setJson($data);
        $gameTemplate->setCreatedAt(new DateTime());
        $this->gameService->save($gameTemplate);
        return $this->json(['gameTemplate' => $gameTemplate], 200,[],['groups'=>['GameTemplate:read', 'User:read']]);
    }
    
    #[Route('/delete/template/{gameTemplate}', name: 'delete_template', methods: 'DELETE')]
    public function delete(GameTemplate $gameTemplate)
    {
        $gameTemplate->setIsActive(false);
        $this->gameService->save($gameTemplate);
        return $this->json(['gameTemplate' => $gameTemplate], 200,[],['groups'=>['GameTemplate:read', 'User:read']]);
    }
    
}

