<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\GameRepository;
use App\Entity\Game;
use App\Entity\GameLocation;
use App\Entity\GameTemplate;
use App\Entity\GameZone;
use App\Entity\Item;
use App\Entity\Location;
use App\Entity\Objective;
use App\Entity\Team;
use App\Repository\ItemTypeRepository;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\GamePasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class GameService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepository, SerializerInterface $serializer)
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
        $gameTemplate = new GameTemplate();
        $gameTemplate->setJson($data);
dump($this->userRepository->find(1));
        // à terme mettre $data['idCreator'] dans le set gameTemplate
        $gameTemplate->setGameMaster($this->userRepository->find( $data['idCreator']));

        $this->em->persist($gameTemplate);

        $this->em->flush();
        return $gameTemplate;
    }

    public function save($entity)
    {
        $this->em->persist($entity);
        $this->em->flush($entity);
    }
}
