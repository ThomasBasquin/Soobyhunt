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
use Symfony\Component\PasswordHasher\Hasher\GamePasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class GameService
{
    public EntityManagerInterface $em;
    private GameRepository $userRepository;
    private SerializerInterface $serializer;
    private ItemTypeRepository $itemTypeRepository;

    public function __construct(ItemTypeRepository $itemTypeRepository,EntityManagerInterface $em, GameRepository $userRepository, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
        $this->itemTypeRepository = $itemTypeRepository;
    }

    public function getAll()
    {
        return $this->userRepository->findAll();
    }

    public function createTemplate($data)
    {
        $gameTemplate = new GameTemplate();
        $gameTemplate->setName($data['name']);
        $gameTemplate->setMode($data['modeDejeu']);
        $gameTemplate->setLimitTime($data['limitTime']);
        $gameTemplate->setPrivate($data['private']);

        // à terme mettre $data['idCreator'] dans le set gameTemplate
        $gameTemplate->setGameMaster($this->userRepository->findOneBy(['id' => 1]));

        $gameZone = new GameZone();
        $gameZone->setGameTemplate($gameTemplate);
        $gameZone->setType('authorized');

        // création de la zone de jeu
        foreach ($data['authorizedZone'] as $location) {
            $newGameLocation = new Location();
            $newGameLocation->setLatitude($location['latitude']);
            $newGameLocation->setLongitude($location['longitude']);
            $newGameLocation->setGameZone($gameZone);
            $this->em->persist($newGameLocation);
        }
        
        // création des zones interdites
        foreach ($data['unauthorizedZone'] as $unauthorizedZones) {
            $gameUnauthorizedZone = new GameZone();
            $gameUnauthorizedZone->setGameTemplate($gameTemplate);
            $gameUnauthorizedZone->setType('unauthorized');
            $this->em->persist($gameUnauthorizedZone);
            foreach ($unauthorizedZones as $unauthorizedZone) {
                
                $unauthorizedZone = new Location();
                $unauthorizedZone->setLatitude($location['latitude']);
                $unauthorizedZone->setLongitude($location['longitude']);
                $unauthorizedZone->setGameZone($gameUnauthorizedZone);
                $this->em->persist($unauthorizedZone);
            }
        }
        
        // création des items
        foreach ($data['items'] as $item) {
            $newItem = new Item();
            $newItem->setName($item['name']);
            $newItem->setQuantity($item['quantite']);
            $newItem->setLatitude($item['latitude']);
            $newItem->setLongitude($item['longitude']);
            $newItem->setGameTemplate($gameTemplate);
            $this->em->persist($newItem);
        }
        
        // Création des teams
        foreach ($data['teams'] as $team) {
            $newTeam = new Team();
            $newTeam->setName($team['name']);
            $newTeam->setPlayerMax($team['nbJoueur']);
            $newTeam->setGameTemplate($gameTemplate);
            $this->em->persist($newTeam);
        }

        // création des objectifs
        foreach ($data['mechants'] as $objective) {
            $newObjective = new Objective();
            $newObjective->setLatitude($objective['latitude']);
            $newObjective->setLongitude($objective['longitude']);
            $newObjective->setGameTemplate($gameTemplate);
            $this->em->persist($newObjective);
        }

        $this->em->persist($gameZone);
        $this->em->persist($gameTemplate);
        $this->em->flush();
        return $gameTemplate;
    }

    public function save(Game $user)
    {
        $this->em->persist($user);
        $this->em->flush($user);
    }
}
