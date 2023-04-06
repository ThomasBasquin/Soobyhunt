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

    #[Route('/{currentUser}/position', name: 'update_position', methods: ['PUT'])]
    public function updatePosition(HubInterface $hub, User $currentUser, Request $request): Response
    {
        $data = $request->toArray();
        $currentUser->setLatitude($data['latitude']);
        $currentUser->setLongitude($data['longitude']);
        $this->em->persist($currentUser);
        $this->em->flush();
        // $this->userService->getEventUserAndAllShitbyDistance($currentUser, $data['viewDistance']);

        $users = $this->userService->findAll();

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
                json_encode($this->serializer->serialize($user, "json", ["groups" => ["User:read"]]))
            );
            $hub->publish($update);
        }

        return $this->json([$currentUser], 200, [], ['groups' => ["User:read"]]);
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
}
