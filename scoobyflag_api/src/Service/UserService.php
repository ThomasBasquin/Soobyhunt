<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;


class UserService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    // private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepository/*, UserPasswordHasherInterface $passwordHasher, SerializerInterface $serializer*/)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        // $this->passwordHasher = $passwordHasher;
        // $this->serializer = $serializer;
    }

    public function getAll()
    {
        return $this->userRepository->findAll();
    }

    public function verifyOldPassword(User $user, string $oldPassword)
    {
        // return $this->passwordHasher->isPasswordValid($user, $oldPassword);
    }

    public function setUserPassword(User $user, string $newPassword)
    {
        // $hashedPassword = $passwordHasher->hashPassword($user, $newPassword);
        // $user->setPassword($hashedPassword);
    }



}
