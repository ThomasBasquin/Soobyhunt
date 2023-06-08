<?php

namespace App\Controller;

use App\Entity\Team;
use App\Entity\Item;
use App\Entity\ItemUser;
use App\Entity\Objective;
use App\Entity\User;
use App\Service\MercureService;
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
use Symfony\Component\HttpFoundation\JsonResponse;
// #[OA\Tag(name: 'userController')]
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/user', name: 'user')]
class UserController extends AbstractController
{

    private UserService $userService;
    protected $em;
    private SerializerInterface $serializer;
    private MercureService $mercureService;

    function __construct(EntityManagerInterface $em, UserService $userService, SerializerInterface $serializer, MercureService $mercureService)
    {
        $this->em = $em;
        $this->userService = $userService;
        $this->serializer = $serializer;
        $this->mercureService = $mercureService;
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
        $data = $this->userService->getEventUserAndAllShitbyDistance($currentUser,/* $data['viewDistance']*/ 30);


        foreach ($data['users'] as $user) {
            if (!$currentUser->getId() == $user->getId() && $currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
                $update = new Update(
                    "https://scoobyflag/user/" . $user->getId(),
                    json_encode($this->serializer->serialize($user, "json", ["groups" => ["User:read"]]))
                );
                $hub->publish($update);
            }
        }
        if ($currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
            $update = new Update(
                "https://scoobyflag/user/0",
                json_encode($this->serializer->serialize($currentUser, "json", ["groups" => ["User:read"]]))
            );
            $hub->publish($update);
        }
        return $this->json($data, 200, [], ['groups' => ["User:read", "Objective:read", "Item:read"]]);
    }

    #[Route('/join', name: 'join', methods: ['POST'])]
    public function join(Request $request): Response
    {
        $data = $request->toArray();
        $user = new User;
        if (isset($data['id'])) {
            $user->setIdOrigin($data['id']);
        }
        $user->setPseudo($data['pseudo']);
        $this->em->persist($user);
        $this->em->flush();

        $users = $this->userService->findAllWithoutUser($user);

        $this->mercureService->publish($users, $user, $this->serializer->serialize($user, "json", ["groups" => ["User:read"]]), false);

        return $this->json($user, 200, [], ['groups' => ["User:read"]]);
    }

    #[Route('/{user}/ready', name: 'is_ready', methods: ['PUT'])]
    public function isReady(User $user): Response
    {
        $user->setIsReady(!$user->isIsReady());
        $this->em->persist($user);
        $this->em->flush();

        $users = $this->userService->findAllWithoutUser($user);

        $this->mercureService->publish($users, $user, $this->serializer->serialize($user, "json", ["groups" => ["User:read"]]), false);

        return $this->json([$user], 200, [], ['groups' => ["Team:get"]]);
    }

    #[Route('/{user}/team/{team}', name: 'change_team', methods: ['PUT'])]
    public function changeTeam(User $user, Team $team): Response
    {
        if ($user->getTeam() != $team) {

            $user->setTeam($team);
            $this->em->persist($user);
            $this->em->flush();

            $users = $this->userService->findAllWithoutUser($user);

            $this->mercureService->publish($users, $users, $this->serializer->serialize($user, "json", ["groups" => ["User:read"]]), false);
        }

        return $this->json([$user], 200, [], ['groups' => ["Team:get"]]);
    }

    #[Route('/{user}/objective/{objective}', name: 'capture_objective', methods: ['PUT'])]
    public function captureObjective(User $user, Objective $objective)
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

    #[Route('/{user}/item/get/{item}', name: 'get_item', methods: ['POST'])]
    public function itemGet(HubInterface $hub, Item $item, Request $request, User $currentUser): Response
    {
        if ($item->getQuantity()) {
            $item->setQuantity($item->getQuantity() - 1);
            $itemUser = new ItemUser();
            $itemUser->setGetBy($currentUser);
            $itemUser->setItem($item);
            $this->em->persist($itemUser);
            $this->em->persist($item);
            $this->em->flush();

            $users = $this->userService->getUsersByItemView( $item->getLongitude(),$item->getLatitude(),300);


            // mercure
            foreach ($users as $user) {
                if (!$currentUser->getId() == $user->getId() && $currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
                    $update = new Update(
                        "https://scoobyflag/user/" . $user->getId(),
                        json_encode($this->serializer->serialize($user, "json", ["groups" => ["User:read"]]))
                    );
                    $hub->publish($update);
                }
            }
            if ($currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
                $update = new Update(
                    "https://scoobyflag/user/0",
                    json_encode($this->serializer->serialize($currentUser, "json", ["groups" => ["User:read"]]))
                );
                $hub->publish($update);
            }

            return $this->json($users, 200, [], ['groups' => ["User:read", "Objective:read", "Item:read"]]);
        }
        return new JsonResponse("Il n'y a plus d'item dispo", 302);
    }

    #[Route('/{user}/item/use/{itemUser}', name: 'use_item', methods: ['PUT'])]
    public function useItem(ItemUser $itemUser, Request $request,  User $user): Response
    {
        // $user = $this->getUser();
        if ($itemUser) {
            $itemUser->setUsed(true);
            $this->em->persist($itemUser);
            $this->em->flush();
            return $this->json($user->getItemUser(), 200, [], ['groups' => ["User:read", "ItemUser:read", "Item:read"]]);
        }
        return new JsonResponse("un pb est survenu", 302);
    }
}
