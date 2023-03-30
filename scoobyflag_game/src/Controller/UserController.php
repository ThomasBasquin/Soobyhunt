<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;
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
        $this->serializer = $serializer;

    }

    #[Route('/{user}/position', name: 'update_position', methods: ['PUT'])]
    public function updatePosition(HubInterface $hub, User $user, Request $request): Response
    {
        $data = $request->toArray();
        $user->setLatitude($data['latitude']);
        $user->setLongitude($data['longitude']);
        $this->em->persist($user);
        $this->em->flush();
        // $this->userService->getEventUserAndAllShitbyDistance($user, $data['viewDistance']);

        $update = new Update(
            'https://scoobyflag/user/0',
            json_encode($this->serializer->serialize($user,"json",["groups" => ["User:read"]]))
        );

        try{

            $hub->publish($update);
        }catch(Exception $e){
            dump($e);
        }

        return $this->json([$user], 200, [], ['groups' => ["User:read"]]);
    }

    #[Route('/join', name: 'join', methods: ['POST'])]
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
