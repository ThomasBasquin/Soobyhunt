<?php

namespace App\Service;

use App\Entity\Game;
use App\Entity\GameInterdictionLocalisation;
use App\Entity\GameLocation;
use App\Entity\Item;
use App\Entity\Location;
use App\Entity\Objective;
use App\Entity\Team;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Repository\ItemRepository;
use App\Repository\ObjectiveRepository;
use App\Repository\TeamRepository;
use Symfony\Component\Serializer\SerializerInterface;

class TeamService
{
    public EntityManagerInterface $em;
    public TeamRepository $teamRepository;

    public function __construct(EntityManagerInterface $em, TeamRepository $teamRepository)
    {
        $this->em = $em;
        $this->teamRepository = $teamRepository;
    }

    public function getAll(){
        return $this->teamRepository->findAll();
    }

    public function save($entity)
    {
        $this->em->persist($entity);
        $this->em->flush($entity);
    }

}
