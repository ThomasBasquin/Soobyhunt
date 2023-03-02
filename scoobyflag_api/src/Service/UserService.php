<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->serializer = $serializer;
    }

    public function getAll()
    {
        return $this->userRepository->findAll();
    }

    public function setUserPassword(User $user, string $newPassword)
    {
        $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($hashedPassword);
        $this->save($user);
    }

    public function save(User $user){
        $this->em->persist($user);
        $this->em->flush($user);
    }


}
