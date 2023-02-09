<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\GameRepository;
use App\Entity\Game;
use App\Entity\Item;
use App\Entity\Location;
use Symfony\Component\PasswordHasher\Hasher\GamePasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class GameService
{
    public EntityManagerInterface $em;
    private GameRepository $userRepository;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $em, GameRepository $userRepository, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
    }

    public function getAll()
    {
        return $this->userRepository->findAll();
    }

    public function createTemplate($data)
    {
        foreach ($data['location'] as $location) {
            $newLocation = new Location();
        }
        foreach ($data['items'] as $item) {
            $newItem = new Item();
        }
        foreach ($data['objective'] as $objective) {
            $newObjective = new Location();
        }
        // $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
        // $user->setPassword($hashedPassword);
    }

    public function save(Game $user){
        $this->em->persist($user);
        $this->em->flush($user);
    }


}
