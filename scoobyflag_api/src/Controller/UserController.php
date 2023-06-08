<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;

#[Route('/user', name: 'app_user_')]
class UserController extends AbstractController
{
    private SerializerInterface $serializer;
    private UserService $userService;

    public function __construct(SerializerInterface $serializer, UserService $userService)
    {
        $this->serializer = $serializer;
        $this->userService = $userService;
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = new User;
        $data = $request->toArray();
        $user->setEmail($data['email']);
        $user->setPseudo($data['pseudo']);

        $this->userService->setUserPassword($user, $data['password']);
        
        return $this->json($user,201,[], ["groups" => ["User:read"]] );
    }
    #[Route('/{user}/getAllTemplate', name: 'get_all_template', methods: ['GET'])]
    public function getTemplate(User $user): JsonResponse
    {
        return $this->json($user->getGameTemplates(),200, [], ['groups' => ['GameTemplate:read', 'User:read']] );
    }
}
