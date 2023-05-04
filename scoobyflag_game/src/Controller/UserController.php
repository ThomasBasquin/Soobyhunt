<?php

namespace App\Controller;

use App\Entity\Team;
use App\Entity\Item;
use App\Entity\ItemUser;
use App\Entity\Objective;
use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
// #[OA\Tag(name: 'userController')]
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/user', name: 'user')]
class UserController extends AbstractController
{

    private UserService $userService;
    protected $em;
    private SerializerInterface $serializer;

    function __construct(EntityManagerInterface $em, UserService $userService, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->userService = $userService;
        $this->serializer=$serializer;
    }

    #[Route('/{currentUser}/position', name: 'get_position', methods: ['GET'])]
    public function position(HubInterface $hub, User $currentUser): Response
    {
        // $data = $request->toArray();
        // $currentUser->setLatitude($data['latitude']);
        // $currentUser->setLongitude($data['longitude']);
        // $this->em->persist($currentUser);
        // $this->em->flush();
        // $this->userService->getEventUserAndAllShitbyDistance($currentUser,/* $data['viewDistance']*/ 30);

        $users = $this->userService->findAll();

        // foreach ($users as $user) {
        //     if (!$currentUser->getId() == $user->getId() && $currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
        //         $update = new Update(
        //             "https://scoobyflag/user/" . $user->getId(),
        //             json_encode($this->serializer->serialize($user, "json", ["groups" => ["User:read"]]))
        //         );
        //         $hub->publish($update);
        //     }
        // }
        // if ($currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {    
        //     $update = new Update(
        //         "https://scoobyflag/user/0",
        //         json_encode($this->serializer->serialize($currentUser, "json", ["groups" => ["User:read"]]))
        //     );
        //     $hub->publish($update);
        // }
        return $this->json($this->userService->getEventUserAndAllShitbyDistance($currentUser,/* $data['viewDistance']*/ 30), 200, [], ['groups' => ["User:read", "Objective:read", "Item:read"]]);
    }
    #[Route('/{currentUser}/position', name: 'update_position', methods: ['PUT'])]
    #[OA\Response(
        response: 200,
        description: 'Retourne la position des users et ce que l\'utilisateur voit',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(groups: ["User:read", "Objective:read", "Item:read"]))
        )
    )]
    #[OA\Parameter(
        name: 'user_update_position',
        in: 'header',
        description: 'Sauvegarde la position et revoie dans mercure ce qu\il voit',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Tag(name: 'user_update_position')]
    public function updatePosition(HubInterface $hub, User $currentUser, Request $request): Response
    {
        $data = $request->toArray();
        $currentUser->setLatitude($data['latitude']);
        $currentUser->setLongitude($data['longitude']);
        $this->em->persist($currentUser);
        $this->em->flush();
        // $this->userService->getEventUserAndAllShitbyDistance($currentUser,/* $data['viewDistance']*/ 30);

        $users = $this->userService->findAll();

        // foreach ($users as $user) {
        //     if (!$currentUser->getId() == $user->getId() && $currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
        //         $update = new Update(
        //             "https://scoobyflag/user/" . $user->getId(),
        //             json_encode($this->serializer->serialize($user, "json", ["groups" => ["User:read"]]))
        //         );
        //         $hub->publish($update);
        //     }
        // }
        // if ($currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {    
        //     $update = new Update(
        //         "https://scoobyflag/user/0",
        //         json_encode($this->serializer->serialize($currentUser, "json", ["groups" => ["User:read"]]))
        //     );
        //     $hub->publish($update);
        // }
        return $this->json($this->userService->getEventUserAndAllShitbyDistance($currentUser,/* $data['viewDistance']*/ 30), 200, [], ['groups' => ["User:read", "Objective:read", "Item:read"]]);
    }

    #[Route('/join', name: 'join', methods: ['POST'])]
    public function join(HubInterface $hub, Request $request): Response
    {
        $data = $request->toArray();
        $user = new User;
        if (isset($data['id'])) {
            $user->setIdOrigin($data['id']);
        }
        $user->setPseudo($data['pseudo']);
        $this->em->persist($user);
        $this->em->flush();

        // $update = new Update(
        //     'https://example.com/users/dunglas',
        //     json_encode(['status' => 'OutOfStock'])
        // );

        // $hub->publish($update);

        return $this->json($user, 200, [], ['groups' => ["User:read"]]);
    }

    #[Route('/{user}/ready', name: 'is_ready', methods: ['PUT'])]
    public function isReady(HubInterface $hub, User $user, Request $request): Response
    {
        $data = $request->toArray();

        $user->setIsReady(!$user->isIsReady());
        $this->em->persist($user);
        $this->em->flush();

        // $update = new Update(
        //     'https://example.com/users/dunglas',
        //     json_encode(['status' => 'OutOfStock'])
        // );

        // $hub->publish($update);

        return $this->json([$user], 200, [], ['groups' => ["User:read"]]);
    }

    #[Route('/{user}/team/{team}', name: 'change_team', methods: ['PUT'])]
    public function changeTeam(HubInterface $hub, User $user, Team $team): Response
    {

        $user->setTeam($team);
        $this->em->persist($user);
        $this->em->flush();

        // $update = new Update(
        //     'https://example.com/users/dunglas',
        //     json_encode(['status' => 'OutOfStock'])
        // );

        // $hub->publish($update);

        return $this->json([$user], 200, [], ['groups' => ["User:read"]]);
    }

    #[Route('/{user}/objective/{objective}', name: 'capture_objective', methods: ['PUT'])]
    public function captureObjective(HubInterface $hub, User $user, Objective $objective)
    {

        $objective->setUser($user);
        $this->em->persist($objective);
        $this->em->flush();

        // $update = new Update(
        //     'https://example.com/users/dunglas',
        //     json_encode(['status' => 'OutOfStock'])
        // );

        // $hub->publish($update);

        return $this->json($user, 200, [], ['groups' => ["User:read", "Objective:read"]]);
    }
}
