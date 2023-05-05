<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\SerializerInterface;

class SecurityController extends AbstractController
{
    
    private SerializerInterface $serializer;
    private UserPasswordHasherInterface $passwordHasher;
    private UserRepository $userRepository;

    public function __construct(SerializerInterface $serializer,UserPasswordHasherInterface $passwordHasher,UserRepository $userRepository)
    {
        $this->serializer=$serializer;
        $this->passwordHasher=$passwordHasher;
        $this->userRepository=$userRepository;
    }
    // #[Route(path: '/login', name: 'app_login')]
    // public function login(AuthenticationUtils $authenticationUtils): Response
    // {
    //     // if ($this->getUser()) {
    //     //     return $this->redirectToRoute('target_path');
    //     // }

    //     // get the login error if there is one
    //     $error = $authenticationUtils->getLastAuthenticationError();
    //     // last username entered by the user
    //     $lastUsername = $authenticationUtils->getLastUsername();

    //     return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    // }

    #[Route(path: "/login", name: "app_login")]
    public function login(Request $request): Response
    {
        $pseudo=$request->toArray()["pseudo"] ?? null;
        $password=$request->toArray()["password"] ?? null;

        if(!$pseudo || !$password){
            throw new BadRequestHttpException("L'pseudo ou le mot de passe n'est pas renseigné");
        }

        $user=$this->userRepository->findOneBy(["pseudo"=> $pseudo]);

        if(!$user){
            throw new BadRequestHttpException("Aucun compte pour ce pseudo");
        }

        if(!$this->passwordHasher->isPasswordValid($user,$password)){
            throw new BadRequestHttpException("Mauvais mot de passe");
        }

        return $this->json($user,200,[],["groups" => ["User:read"]]);

    }

    #[Route(path: "/logout", name: "app_logout")]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    // #[Route('/create', name: 'create', methods: ['POST'])]
    // public function create(Request $request): Response
    // {
    //     $pseudo=$request->toArray()["pseudo"] ?? "";
    //     $alreadyRegistred=$this->userRepository->findOneBy(["pseudo"=>$pseudo]);
    //     if($alreadyRegistred){
    //         throw new HttpException(409,"Ce psuedo à déjà un compte");
    //     }
    //     $user = $this->serializer->deserialize($request->getContent(), User::class, "json");
    //     $hashedPassword = $this->passwordHasher->hashPassword(
    //         $user,
    //         $request->toArray()["password"]
    //     );
    //     $user->setPassword($hashedPassword);
    //     $this->userRepository->save($user,true);
    //     return $this->json($user,201,[],["groups" => ["User:read"]]);
    // }
    
    //  /**
    //  * Création d'un utilisateur
    //  *
    //  *
    //  * @Route("/api/register", methods={"POST"})
    //  * @OA\Response(
    //  *     response=201,
    //  *     description="Retourne l'utilisateur créer",
    //  *     @OA\JsonContent(
    //  *        type="array",
    //  *        @OA\Items(ref=@Model(type=User::class, groups={"User:read"}))
    //  *     )
    //  * )
    //  * @OA\Parameter(
    //  *     name="email",
    //  *     in="header",
    //  *     required=true,
    //  *     description="L'email de l'utilisateur",
    //  *     @OA\Schema(type="string")
    //  * )
    //  * @OA\Parameter(
    //  *     name="password",
    //  *     in="header",
    //  *     required=true,
    //  *     description="Le mot de passe de l'utilisateur",
    //  *     @OA\Schema(type="string")
    //  * )
    //  * @OA\Parameter(
    //  *     name="firstname",
    //  *     in="header",
    //  *     required=true,
    //  *     description="Prénom de l'utilisateur",
    //  *     @OA\Schema(type="string")
    //  * )
    //  * @OA\Parameter(
    //  *     name="lastname",
    //  *     in="header",
    //  *     required=true,
    //  *     description="Nom de l'utilisateur",
    //  *     @OA\Schema(type="string")
    //  * )
    //  * @OA\Tag(name="Auth")
    //  * @Security()
    //  */


}
