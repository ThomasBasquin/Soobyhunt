<?php

namespace App\Controller;

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
#[Route('/user', name: 'user')]
class UserController extends AbstractController
{

    private UserService $userService;
    protected $em;

    function __construct(EntityManagerInterface $em,UserService $userService)
    {
        $this->em = $em;
        $this->userService = $userService;


    }

    #[Route('/{user}/position', name: 'update_position', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Retourne la position des users et ce que l\'utilisateur voit',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model( groups: ["User:read", "Objective:read", "Item:read"]))
        )
    )]
    #[OA\Parameter(
        name: 'user_update_position',
        in: 'header',
        description: 'Sauvegarde la position et revoie dans mercure ce qu\il voit',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Tag(name: 'user_update_position')]
    public function updatePosition(HubInterface $hub, User $user/*, Request $request*/): Response
    {
        // $data = $request->toArray();
        // $user->setLatitude($data['latitude']);
        // $user->setLongitude($data['longitude']);
        // $this->em->persist($user);
        // $this->em->flush();
    $this->userService->getEventUserAndAllShitbyDistance($user,/* $data['viewDistance']*/ 30);

        // $update = new Update(
        //     'https://example.com/users/dunglas',
        //     json_encode(['status' => 'OutOfStock'])
        // );

        // $hub->publish($update);

        return $this->json($this->userService->getEventUserAndAllShitbyDistance($user,/* $data['viewDistance']*/ 30), 200, [], ['groups' => ["User:read", "Objective:read", "Item:read"]]);
    }

    #[Route('/join', name: 'join', methods: ['POST'])]
    #[OA\Response(
        response: 200,
        description: 'Créer un user en fonction d\'un user central',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type:User::class, groups: ["User:read"]))
        )
    )]
    #[OA\Parameter(
        name: 'user_join',
        in: 'header',
        description: 'Créer un user en fonction de ce qu\'on renvoie',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Tag(name: 'user_join')]
    public function join(HubInterface $hub, Request $request): Response
    {
        $data = $request->toArray();
        $user = new User;
        if(isset($data['id']) ){
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

        return $this->json([$user], 200, [], ['groups' => ["User:read"]]);
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

    
}
