<?php

namespace App\Controller;

use App\Entity\Team;
use App\Service\TeamService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/team', name: 'team_')]
class TeamController extends AbstractController
{
    private TeamService $teamService;
    private UserService $userService;

    public function __construct(TeamService $teamService, UserService $userService)
    {
        $this->teamService = $teamService;
        $this->userService = $userService;
    }

    #[Route(path: "", name: "getAll", methods: ["GET"])]
    public function getAll(): Response
    {
        //"name": "equipe1", "nbPlayer": 4, "players": [[Object]]}, {"id": 2, "name": "equipe2", "nbPlayer": 8, "players": [[Object]]}
        $anyTeam = ["id" => null,"name"=> "Sans équipe", "nbPlayer" => null, "players" => $this->userService->findby(["team" => null])];
        $teams=$this->teamService->getAll();
        return $this->json([...$teams, $anyTeam], 200, [], ["groups" => ["Team:get"]]);
    }

    #[Route(path: "", name: "createOne", methods: ["POST"])]
    public function createOne(Request $request, SerializerInterface $serializer): Response
    {
        $team = $serializer->deserialize($request->getContent(), Team::class, "json");
        $this->teamService->save($team);

        return $this->json($team, 201, [], ["groups" => ["Team:get"]]);
    }

    #[Route(path: "/{team}", name: "getOne", methods: ["GET"])]
    public function getOne(Team $team): Response
    {
        return $this->json($team, 200, [], ["groups" => ["Team:get"]]);
    }

    #[Route(path: "/{team}", name: "modifyOne", methods: ["PUT"])]
    public function modifyOne(Team $team, Request $request, SerializerInterface $serializer): Response
    {
        $serializer->deserialize($request->getContent(), Team::class, "json", ["groups" => ["Team:get"], AbstractNormalizer::OBJECT_TO_POPULATE => $team]);
        $this->teamService->save($team);

        return $this->json($team, 202, [], ["groups" => ["Team:get"]]);
    }
}
